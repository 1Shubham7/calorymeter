package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type FoodEntry struct {
	ID          primitive.ObjectID `bson:"id"`
	Dish        string             `json:"dish" binding:"required"`
	Fat         int                `json:"fat"`
	Protein     string             `json:"protein"`
	Ingredients string             `json:"ingredients"`
	Calories    int                `json:"calories" binding:"required,min=1"`
	Tip string `json:"tip"`
}
