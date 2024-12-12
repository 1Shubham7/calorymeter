package api

import (
	"context"
	"net/http"
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/1shubham7/calorymeter/models"
)

var userCollection *mongo.Collection = CreateCollection(Client, "users")

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
	// perform checks
	// give tokens

	var c, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	result, insertErr := userCollection.InsertOne(c, user)
	if insertErr != nil {
		msg := "user couldn't sign in, try again!"
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": msg})
		fmt.Println(insertErr)
		return
	}

	ctx.JSON(http.StatusOK, result)
}