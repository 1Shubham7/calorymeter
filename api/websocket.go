package api

import (
	"fmt"
	"net/http"

	"github.com/1shubham7/calorymeter/websocket"
)

func ServeWS(pool *websocket.Pool, w http.ResponseWriter, r *http.Request) {

	// Creating pool for websockets
	
	// http.ResponseWriter ~ ctx.Writer
	// http.Request ~ ctx.Request
	conn, err := websocket.Upgrade(w, r)
	if err != nil {
		fmt.Fprintf(w, "%+v\n", err)
		return
	}

	client := &websocket.Client{
		Conn: conn,
		Pool: pool,
	}

	pool.Register <- client
	client.Read()
}