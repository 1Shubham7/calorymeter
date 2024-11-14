package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"github.com/google/generative-ai-go/genai"
)

type Tip struct{
	ID primitive.ObjectID `bson:"id"`
	AITip  *genai.GenerateContentResponse `json:"aitip"`
}
