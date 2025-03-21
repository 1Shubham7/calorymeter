package middleware

import (
	"net/http"

	"github.com/1shubham7/calorymeter/helpers"
	"github.com/gin-gonic/gin"
)

func Authentication() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		token := ctx.Request.Header.Get("token")
		if token == "" {
			msg := "No token present in header"
			ctx.JSON(http.StatusBadRequest, gin.H{"error": msg})
			ctx.Abort()
			return
		}

		claims, err := helpers.ValidateToken(token)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			ctx.Abort()
			return
		}

		ctx.Set("email", claims.Email)
		ctx.Set("first_name", claims.FirstName)
		ctx.Set("username", claims.Username)

		ctx.Next()
	}
}