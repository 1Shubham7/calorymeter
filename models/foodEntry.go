package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type FoodEntry struct {
	ID          primitive.ObjectID `bson:"id"`
	Dish        string             `json:"dish" binding:"required"`
	Ingredients string             `json:"ingredients"`
	Calories    int                `json:"calories" binding:"required,min=1"`
	Fat         int                `json:"fat"`
	Protein     string             `json:"protein"`
}
