package websocket

import (
	"sync"
	"log"

	"github.com/gorilla/websocket"
)

type Client struct {
	ID string
	Conn *websocket.Conn
	Pool *Pool
	mu sync.Mutex
}

type Message struct {
	Type int    `json:"type"`
	Body string `json:"body"`
}

func (c *Client) Read() {
	defer func() {
		c.Pool.Unregister <- c
		c.Conn.Close()
	} ()

	for {
		msgType, p, err := c.Conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}

		msg := Message{
			Type: msgType,
			Body: string(p),
		}

		c.Pool.Broadcast <- msg
	}
}