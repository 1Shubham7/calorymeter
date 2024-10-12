package api

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func DBinstance() *mongo.Client{
	MongoDB := "mongodb://localhost:27017/caloriesdb"

	client, err := mongo.NewClient(options.Client().ApplyURI(MongoDB))
	if err != nil{
		log.Fatal(err)
	}

	context, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	err = client.Connect(context)
	if err != nil{
		log.Fatal(err)
	}

	fmt.Println("Connect to MongoDB :)")
	return client
}