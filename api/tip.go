package api

import (
	"context"
	"net/http"
	"os"
	"github.com/joho/godotenv"
	"log"

	"github.com/1shubham7/calorymeter/models"
	"github.com/gin-gonic/gin"
	"github.com/google/generative-ai-go/genai"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"google.golang.org/api/option"
)

func GetTip(ctx *gin.Context){
    tip := &models.Tip{}
	tip.ID = primitive.NewObjectID()

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	gemeniAPI := os.Getenv("GEMINI_API_KEY")

	c := context.Background()
	client, err := genai.NewClient(c, option.WithAPIKey(gemeniAPI))
	if err != nil {
		log.Fatal(err)
	}
	defer client.Close()

	model := client.GenerativeModel("gemini-1.5-flash")
	resp, err := model.GenerateContent(c, genai.Text("Explain how fasting works in a short para"))
	if err != nil {
		log.Fatal(err)
	}

    tip.AITip = resp

    ctx.JSON(http.StatusOK, tip)
}
