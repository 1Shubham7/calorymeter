package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type  User struct {
	ID primitive.ObjectID `json:"user_id"`
	Email string `json:"email"`
	HashedPassword string `json:"password"`
}
