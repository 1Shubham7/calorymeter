package api

import (
	"context"
	"net/http"
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/1shubham7/calorymeter/models"
	"github.com/1shubham7/calorymeter/db"
)

var userCollection *mongo.Collection = OpenCollection(Client, "users")

func SignUpUser(ctx *gin.Context) {
	user := models.User{}

	err := ctx.BindJSON(&user)
	if (err != nil) {
		ctx.JSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	err = validate.Struct(user)
	if (err != nil) {
		ctx.JSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	user.ID = primitive.NewObjectID()

	var c, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	// Email Validation
	count, err := userCollection.CountDocuments(c, bson.M{"email": user.Email})
	if (err != nil) {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if (count > 0) {
		msg := "This Email has already been registered with a different user"
		ctx.JSON(http.StatusBadRequest, gin.H{"error": msg})
		return
	}

	// UserName Validation

	// Hashing Password
	password, err := helpers.HashPassword(user.HashedPassword)
	user.HashedPassword = password

	// Additional Details
	user.CreatedAt, err =  time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
	if (err != nil) {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Tokens and stuff

	result, insertErr := userCollection.InsertOne(c, user)
	if insertErr != nil {
		msg := "user couldn't sign in, try again!"
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": msg})
		fmt.Println(insertErr)
		return
	}

	ctx.JSON(http.StatusOK, result)
}
