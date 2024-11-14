package api

import (
	"context"
	"net/http"

	"github.com/1shubham7/calorymeter/models"
	"github.com/gin-gonic/gin"
)

func GetTip(ctx *gin.Context){
    var tip *models.Tip

    tip.AITip = "Shubham is the best"
    ctx.JSON(http.StatusOK, tip)
}
