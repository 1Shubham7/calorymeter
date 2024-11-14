package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Tip struct{
	ID primitive.ObjectID `bson:"id"`
	AITip string `json:aitip`
}