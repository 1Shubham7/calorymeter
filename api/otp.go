package api

import (
	"context"
	"net/http"
	"time"

	"github.com/1shubham7/calorymeter/db"
	"github.com/1shubham7/calorymeter/models"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
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

	c, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()
    _, insertErr := otpCollection.InsertOne(c, optHandler)
	if insertErr != nil {
		msg := "otp couldn't be added to db"
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": msg})
		return
	}

	mail.SendMail()
	ctx.JSON(http.StatusOK, gin.H{
		"username": optHandler.Username,
		"email": optHandler.Email,
	})
}