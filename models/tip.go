package models

import (
	"github.com/google/generative-ai-go/genai"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Tip struct {
	ID    primitive.ObjectID             `bson:"id"`
	AITip *genai.GenerateContentResponse `json:"aitip"`
}
