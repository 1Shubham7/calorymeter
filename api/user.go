package api

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/1shubham7/calorymeter/db"
	"github.com/1shubham7/calorymeter/helpers"
	"github.com/1shubham7/calorymeter/models"
)

var userCollection *mongo.Collection = db.OpenCollection(db.Client, "users")

func SignUpUser(ctx *gin.Context) {
	user := models.User{}

	err := ctx.BindJSON(&user)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = validate.Struct(user)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user.ID = primitive.NewObjectID()

	var c, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	// Email Validation
	count, err := userCollection.CountDocuments(c, bson.M{"email": user.Email})
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if count > 0 {
		msg := "This Email has already been registered with a different user"
		ctx.JSON(http.StatusBadRequest, gin.H{"error": msg})
		return
	}

	//OTP Validation
	otpFilter := bson.M{"otp": user.OTP}
	var otpHandler models.OTPHandler

	err = otpCollection.FindOne(c, otpFilter).Decode(&otpHandler)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "No OTP found for the given email"})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	// OTP matches
	if user.OTP != otpHandler.OTP {
		err = fmt.Errorf("incorrect otp")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	// Delete the OPT entry from optCollection
	_, err = otpCollection.DeleteOne(c, otpFilter)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Hashing Password
	password, err := helpers.HashPassword(user.HashedPassword)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	user.HashedPassword = password

	// Additional Details
	user.CreatedAt, err = time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Tokens
	token, refreshToken, err := helpers.GenerateTokens(user.Email, user.UserName, user.FirstName)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	user.Token = token
	user.RefreshToken = refreshToken

	result, insertErr := userCollection.InsertOne(c, user)
	if insertErr != nil {
		msg := "user couldn't sign in, try again!"
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": msg})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"result": result,
		"user":   user,
	})
}

func Login(ctx *gin.Context) {
	var c, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	var user models.User
	var userFromDb models.User

	err := ctx.BindJSON(user)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = userCollection.FindOne(c, bson.M{"email": user.Email}).Decode(userFromDb)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	isValid, msg := helpers.VerifyPassword(user.HashedPassword, userFromDb.HashedPassword)
	if !isValid {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": msg})
		return
	}

	token, refreshToken, _ := helpers.GenerateTokens(userFromDb.Email, userFromDb.UserName, userFromDb.FirstName)
	helpers.RefreshTokens(token, refreshToken, userFromDb.UserName)

	ctx.JSON(http.StatusOK, userFromDb)
}
