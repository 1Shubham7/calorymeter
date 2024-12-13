package helpers

import (
	"context"
	"os"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/1shubham7/calorymeter/db"
)

type SignedDetails struct {
	Email     string
	Username  string
	FirstName string
	jwt.StandardClaims
}

var userCollection *mongo.Collection = db.OpenCollection(db.Client, "user")
var PRIVATE_KEY string = os.Getenv("PRIVATE_KEY")

func GenerateTokens(email, username, firstname string) (signedToken, signedRefreshToken string, err error) {
	claims := &SignedDetails{
		Email:     email,
		Username:  username,
		FirstName: firstname,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Local().Add(time.Hour * time.Duration(24)).Unix(),
		},
	}

	refreshClaims := &SignedDetails{
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Local().Add(time.Hour * time.Duration(168)).Unix(),
		},
	}

	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(PRIVATE_KEY))
	if err != nil {
		return
	}
	refreshToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims).SignedString([]byte(PRIVATE_KEY))
	if err != nil {
		return
	}

	return token, refreshToken, nil
}

func RefreshTokens(signedToken, signedRefreshToken, username string) error {
	var c, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	// Create an updateObj Document
	var updateObj primitive.D

	// Add tokens to updateObj
	updateObj = append(updateObj, bson.E{Key: "token", Value: signedToken})
	updateObj = append(updateObj, bson.E{Key: "refresh_token", Value: signedRefreshToken})

	upsert := true // means if document with username doesn’t exist, it will create one
	filter := bson.M{"username": username}
	opt := options.UpdateOptions{
		Upsert: &upsert,
	}

	_, err := userCollection.UpdateOne(
		c, filter, bson.D{{Key: "$set", Value: updateObj}}, &opt,
	)
	if err != nil {
		return err
	}
	return nil
}

func ValidateToken(signedToken string) (claims *SignedDetails, msg string) {
	token, _ := jwt.ParseWithClaims(
		signedToken,
		&SignedDetails{},
		func(token *jwt.Token) (interface{}, error) {
			return []byte(PRIVATE_KEY), nil
		},
	)

	claims, ok := token.Claims.(*SignedDetails)

	// Invalid Token
	if !ok {
		msg = "the token is invalid"
		return
	}

	// Expired Token
	if claims.ExpiresAt < time.Now().Local().Unix() {
		msg = "token has expired"
		return
	}

	return claims, msg
}
