package api

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

type CaloriesRequest struct {
	Dish        string `json:"dish"`
	Ingredients string `json:"ingredients"`
}

func CalculateCalories(ctx *gin.Context) {
	var req CaloriesRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	if strings.TrimSpace(req.Dish) == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "dish name is required"})
		return
	}

	body, err := json.Marshal(req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to process request"})
		return
	}

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Post("http://localhost:5001/calculate", "application/json", bytes.NewBuffer(body))
	if err != nil {
		ctx.JSON(http.StatusServiceUnavailable, gin.H{
			"error": "ML service is unavailable. Run: cd ml-service && python app.py",
		})
		return
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to read ML service response"})
		return
	}

	ctx.Data(resp.StatusCode, "application/json", respBody)
}
