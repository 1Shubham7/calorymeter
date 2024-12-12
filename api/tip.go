package api

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/joho/godotenv"

	"github.com/1shubham7/calorymeter/models"
	"github.com/gin-gonic/gin"
	"github.com/google/generative-ai-go/genai"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"google.golang.org/api/option"
)

func GetTip(ctx *gin.Context) {
	tip := &models.Tip{}
	tip.ID = primitive.NewObjectID()

	var foodEntries []bson.M
	contextT, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	cursor, err := entryCollection.Find(contextT, bson.M{})
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err})
		fmt.Println(err)
		return
	}

	defer cancel()

	err = cursor.All(ctx, &foodEntries)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	err = godotenv.Load()
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

	// var query string
	// foodEntries is a slice of maps
	var builder strings.Builder
	for i := range foodEntries {
		e := foodEntries[i]
		for key, val := range e {
			if key == "id" || key == "protein" || key == "_id" {
				continue
			}
			builder.WriteString(fmt.Sprintf("%v is %v. ", key, val))
		}
		builder.WriteString("\n")
	}
	builder.WriteString(`\n
	Firstly, Tell me if today's day was a plus or a minus in my weight loss journey.
	Give me 3 short key points as advices for loosing my weight or gaining acc. to the food I ate.
	I know you are not a docter, but give me some advices (don't mention you are a docker, I know it already).
	Also use emojis in your response.
	You answer must be in tags, consider as if you are giving me code for a middle of a react component (don't use html tags).
	Also if the data I am giving is wrong or insufficient, just mention that in a funny way.
	`)

	query := builder.String()

	resp, err := model.GenerateContent(c, genai.Text(query))
	if err != nil {
		log.Fatal(err)
	}

	tip.AITip = resp
	ctx.JSON(http.StatusOK, tip)
}
