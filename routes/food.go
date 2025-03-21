package routes

import (
	"github.com/gin-gonic/gin"

	"github.com/1shubham7/calorymeter/api"
)

func FoodRoutes(incomingRoutes *gin.Engine) {
	incomingRoutes.GET("/food/entries", api.GetFoodEntries)
	incomingRoutes.GET("/food/entry/:id", api.GetFoodEntryByID)
	incomingRoutes.GET("/food/ingredient/:ingredient", api.GetFoodEntryByIngredient)
	incomingRoutes.PUT("/food/entry/update/:id", api.UpdateFoodEntry)
	incomingRoutes.PUT("/food/ingredient/update/:id", api.UpdateFoodIngredient)
	incomingRoutes.DELETE("/food/entry/delete/:id", api.DeleteFoodEntry)
	incomingRoutes.POST("/food/create", api.AddFoodEntry)
}
