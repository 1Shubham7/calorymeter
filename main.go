package main

import (
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"github.com/1shubham7/calorymeter/api"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	router := gin.New()
	router.Use(gin.Logger())
	router.Use(cors.Default())

	router.POST("/food/create", api.AddFoodEntry)

	router.GET("/entries", api.GetFoodEntries)
	router.GET("/entry/:id", api.GetFoodEntryByID)
	router.GET("/ingredient/:ingredient", api.GetFoodEntryByIngredient)

	router.PUT("/entry/update/:id", api.UpdateFoodEntry)
	router.PUT("/ingredient/update/:id", api.UpdateFoodIngredient)

	router.DELETE("/entry/delete/:id", api.DeleteFoodEntry)

	router.Run(":" + port)
}
