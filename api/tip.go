package api

import (
	"net/http"

	"github.com/1shubham7/calorymeter/models"
	"github.com/gin-gonic/gin"
)

func GetTip(ctx *gin.Context){
    tip := &models.Tip{}

    tip.AITip = "Shubham is the best"
    ctx.JSON(http.StatusOK, tip)
}
