package api

import (
	"context"
	"net/http"
	"time"
	"math/rand"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/1shubham7/calorymeter/db"
	"github.com/1shubham7/calorymeter/helpers"
	"github.com/1shubham7/calorymeter/mail"
	"github.com/1shubham7/calorymeter/models"
)

var otpCollection *mongo.Collection = db.OpenCollection(db.Client, "otp")

func SendOTPHandler(ctx *gin.Context) {
	var optHandler models.OTPHandler

	err := ctx.BindJSON(&optHandler)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = validate.Struct(optHandler)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	optHandler.ID = primitive.NewObjectID()
	
	// Range of OTP [1000, 9999]
	optHandler.OTP = rand.Intn(9000) + 1000

	c, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()
    _, insertErr := otpCollection.InsertOne(c, optHandler)
	if insertErr != nil {
		msg := "otp couldn't be added to db"
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": msg})
		return
	}

	name := "Shubham from Calorymeter"
	from := "smyik1306@gmail.com"
	emailPassword := "cezs reyw kgku gggj"
	emailSender := mail.NewSender(name, from, emailPassword)

	to := []string{optHandler.Email}
	subject, content, attachFiles := helpers.EmailDetails(optHandler.OTP, to[0])
	err = emailSender.SendEmail(subject, content, to, nil, nil, attachFiles)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"username": optHandler.Username,
		"email": optHandler.Email,
	})
}