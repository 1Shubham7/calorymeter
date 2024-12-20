package routes

import (
	"github.com/gin-gonic/gin"

	"github.com/1shubham7/calorymeter/api"
)

func FoodRoutes(incomingRoutes *gin.Engine) {
	incomingRoutes.GET("/entries", api.GetFoodEntries)
	incomingRoutes.GET("/entry/:id", api.GetFoodEntryByID)
	incomingRoutes.GET("/ingredient/:ingredient", api.GetFoodEntryByIngredient)
	incomingRoutes.PUT("/entry/update/:id", api.UpdateFoodEntry)
	incomingRoutes.PUT("/ingredient/update/:id", api.UpdateFoodIngredient)
	incomingRoutes.DELETE("/entry/delete/:id", api.DeleteFoodEntry)
	incomingRoutes.POST("/food/create", api.AddFoodEntry)
}