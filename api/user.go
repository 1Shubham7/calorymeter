package api

import (
	"context"
	"net/http"
	"time"

	"github.com/1shubham7/calorymeter/models"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// creating a new collection
var usersCollection *mongo.Collection = CreateCollection(Client, "users")

func AddUser(ctx *gin.Context){
	var user models.User

	err := ctx.BindJSON(&user)
	if err != nil {
		ctx.JSON (http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = validate.Struct(user)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user.ID = primitive.NewObjectID()
	c, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()
	result, insertErr := usersCollection.InsertOne(c, user)
	if insertErr != nil {
		
	}
}