package main

import (
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"github.com/1shubham7/calorymeter/api"
	"github.com/1shubham7/calorymeter/routes"
	"github.com/1shubham7/calorymeter/websocket"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	router := gin.New()
	router.Use(gin.Logger())

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	pool := websocket.NewPool()
	go pool.Start()

	router.GET("/ws", func(c *gin.Context) {
		api.ServeWS(pool, c.Writer, c.Request)
	})

	routes.FoodRoutes(router)
	routes.UserRoutes(router)
	routes.TipRoutes(router)

	router.Run(":" + port)
}
