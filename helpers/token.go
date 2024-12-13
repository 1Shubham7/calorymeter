package helpers

import (
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/1shubham7/calorymeter/api"
)

var userCollection *mongo.Collection = api.OpenCollection(api.Client, "user")

func CreateTokens() {

}

func RefreshToken() {

}

func ValidateToken() {

}