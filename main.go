package main

import (
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"github.com/1shubham7/calorymeter/api"
	"github.com/1shubham7/calorymeter/websocket"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	router := gin.New()
	router.Use(gin.Logger())

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	router.POST("/food/create", api.AddFoodEntry)
	router.POST("/signup", api.SignUpUser)
	router.POST("/signupopt", api.SendOTPHandler)
	router.POST("/login", api.Login)

	router.GET("/ws", api.ServeWS)

	router.GET("/entries", api.GetFoodEntries)
	router.GET("/entry/:id", api.GetFoodEntryByID)
	router.GET("/ingredient/:ingredient", api.GetFoodEntryByIngredient)

	router.PUT("/entry/update/:id", api.UpdateFoodEntry)
	router.PUT("/ingredient/update/:id", api.UpdateFoodIngredient)

	router.DELETE("/entry/delete/:id", api.DeleteFoodEntry)

	router.GET("/tip", api.GetTip)

	router.Run(":" + port)
}
