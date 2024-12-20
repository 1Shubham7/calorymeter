package routes

import (
	"github.com/gin-gonic/gin"

	"github.com/1shubham7/calorymeter/api"
)

func UserRoutes(incomingRoutes *gin.Engine){
	incomingRoutes.POST("/signup", api.SignUpUser)
	incomingRoutes.POST("/signupopt", api.SendOTPHandler)
	incomingRoutes.POST("/login", api.Login)
}