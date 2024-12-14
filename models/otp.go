package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type OTPHandler struct {
	ID       primitive.ObjectID `json:"otp_id"`
	Username string `json:"username" validate:"required"`
}