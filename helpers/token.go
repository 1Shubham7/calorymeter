package helpers

import (
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/1shubham7/calorymeter/db"
)

var userCollection *mongo.Collection = db.OpenCollection(db.Client, "user")

func CreateTokens() {

}

func RefreshToken() {

}

func ValidateToken() {

}