package routes

import (
	"github.com/gin-gonic/gin"
	
	"github.com/1shubham7/calorymeter/api"
)

func TipRoutes(incomingRoutes *gin.Engine) {
	incomingRoutes.GET("/tip", api.GetTip)
}