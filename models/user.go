package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID             primitive.ObjectID `json:"user_id"`
	UserName       string             `json:"username" validate:"required"`
	FirstName      string             `json:"first_name"`
	LastName       string             `json:"last_name"`
	Email          string             `json:"email" validate:"required"`
	HashedPassword string             `json:"password"`
	User_type      string             `json:"user_type"`
	Token          string             `json:"token"`
	RefreshToken   string             `json:"refresh_token"`
	CreatedAt      time.Time          `json:"created_at"`
}
