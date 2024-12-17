package api

import (
	"fmt"

	"github.com/1shubham7/calorymeter/websocket"
	"github.com/gin-gonic/gin"
)

func ServeWS(ctx *gin.Context) {

	// Creating pool for websockets
	pool := websocket.NewPool()
	go pool.Start()

	// http.ResponseWriter ~ ctx.Writer
	// http.Request ~ ctx.Request
	conn, err := websocket.Upgrade(ctx.Writer, ctx.Request)
	if err != nil {
		fmt.Fprintf(ctx.Writer, "%+v\n", err)
		return
	}

	client := &websocket.Client{
		Conn: conn,
		Pool: pool,
	}

	pool.Register <- client
	client.Read()
}