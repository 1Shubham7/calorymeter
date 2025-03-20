package websocket

import (
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024, // Buffer size for incoming messages
	WriteBufferSize: 1024, // Buffer size for outgoing messages
}

func Upgrade(w http.ResponseWriter, r *http.Request) (*websocket.Conn, error) {

	// checkorigin is made a func that always returns true
	// meaning it will always accept WebSocket connection requests, regardless of the origin.
	upgrader.CheckOrigin = func(r *http.Request) bool {
		return true
	}

	// r is upgraded to a WebSocket connection
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	return conn, nil
}
