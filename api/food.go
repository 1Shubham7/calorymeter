package api

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/1shubham7/calorymeter/models"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var validate = validator.New()
var entryCollection *mongo.Collection = OpenCollection(Client, "calories")

func AddFoodEntry(ctx *gin.Context) {

	var foodEntry models.FoodEntry

	err := ctx.BindJSON(&foodEntry)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	err = validate.Struct(foodEntry)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	foodEntry.ID = primitive.NewObjectID()
	var c, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	result, insertErr := entryCollection.InsertOne(c, foodEntry)
	if insertErr != nil {
		msg := fmt.Sprintf("order item was not created")
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": msg})
		fmt.Println(insertErr)
		return
	}
	defer cancel()

	ctx.JSON(http.StatusOK, result)
}

func GetFoodEntries(ctx *gin.Context) {
	context, cancel := context.WithTimeout(context.Background(), 100*time.Second)

	var foodEntries []bson.M
	cursor, err := entryCollection.Find(context, bson.M{})
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	err = cursor.All(ctx, &foodEntries)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	defer cancel()
	fmt.Println(foodEntries)
	ctx.JSON(http.StatusOK, foodEntries)
}

func GetFoodEntryByID(ctx *gin.Context) {
	id := ctx.Params.ByName("id")

	docID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	context, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	result := entryCollection.FindOne(context, bson.M{"_id": docID})

	var foodEntry models.FoodEntry
	if err := result.Decode(&foodEntry); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}
	foodEntry.Tip = "Shubham"
	ctx.JSON(http.StatusOK, foodEntry)

	defer cancel()
}

func GetFoodEntryByIngredient(ctx *gin.Context) {

	ingredient := ctx.Params.ByName("id")
	ctxTimeout, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	var entries []bson.M
	cursor, err := entryCollection.Find(ctxTimeout, bson.M{"ingredients": ingredient})
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	err = cursor.All(ctxTimeout, &entries)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	ctx.JSON(http.StatusOK, entries)
}

func UpdateFoodEntry(ctx *gin.Context) {

	id := ctx.Params.ByName("id")
	docID, _ := primitive.ObjectIDFromHex(id)

	var foodEntry models.FoodEntry
	err := ctx.BindJSON(&foodEntry)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	context, cancel := context.WithTimeout(context.Background(), 100*time.Second)

	err = validate.Struct(foodEntry)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	result, err := entryCollection.ReplaceOne(context,
		bson.M{"_id": docID},
		bson.M{
			"dish":        foodEntry.Dish,
			"fat":         foodEntry.Fat,
			"ingredients": foodEntry.Ingredients,
			"calories":    foodEntry.Calories,
		},
	)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}
	defer cancel()
	ctx.JSON(http.StatusOK, result.ModifiedCount)
}

func UpdateFoodIngredient(ctx *gin.Context) {
	id := ctx.Params.ByName("id")
	docID, _ := primitive.ObjectIDFromHex(id)

	ctxTimeout, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	type Ingredient struct {
		Ingredients *string `json:"ingredients"`
	}
	var ingredient Ingredient
	if err := ctx.BindJSON(&ingredient); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	result, err := entryCollection.UpdateOne(ctxTimeout,
		bson.M{"_id": docID},
		bson.D{{"$set", bson.D{{"ingredients", ingredient.Ingredients}}}},
	)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	ctx.JSON(http.StatusOK, result.MatchedCount)
}

func DeleteFoodEntry(ctx *gin.Context) {
	id := ctx.Params.ByName("id")
	docID, _ := primitive.ObjectIDFromHex(id)

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
