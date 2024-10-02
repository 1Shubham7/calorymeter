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
)

var entryCollection *mongo.Collection = openCollection(Client, "calories")

func AddFoodEntry(ctx *gin.Context) {

}

func GetFoodEntries(ctx *gin.Context) {

}

func GetFoodEntry(ctx *gin.Context) {

}

func GetFoodEntryByIngredient(ctx *gin.Context) {

}

func UpdateFoodEntry(ctx *gin.Context) {

}

func UpdateFoodIngredient(ctx *gin.Context) {

}

func DeleteFoodEntry(ctx *gin.Context) {
	id := ctx.Params.ByName("id")

	docID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	context, cancel := context.WithTimeout(context.Background(), 100*time.Second)

	result, err := entryCollection.DeleteOne(context, bson.M{"_id": docID})

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	defer cancel()
	ctx.JSON(http.StatusOK, result.DeletedCount)
}
