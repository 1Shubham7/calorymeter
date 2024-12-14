package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID             primitive.ObjectID `json:"user_id"`
	UserName       string             `json:"username"`
	FirstName      string             `json:"first_name"`
	LastName       string             `json:"last_name"`
	Email          string             `json:"email"`
	HashedPassword string             `json:"password" validate:"required"`
	User_type      string             `json:"user_type"`
	OTP            int                `json:"otp" validate:"required"`
	Token          string             `json:"token"`
	RefreshToken   string             `json:"refresh_token"`
	CreatedAt      time.Time          `json:"created_at"`
}
