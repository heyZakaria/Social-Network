package realTime

import (
	"fmt"
	"net/http"
	"socialNetwork/utils"
	"sync"

	"github.com/gorilla/websocket"
)



var clients = make(map[*Client]bool)
var broadcast = make(chan []byte)
var mutex = &sync.Mutex{}



func GroupChat(conn *websocket.Conn, r *http.Request) {
	
	client := &Client{
		Conn:     conn,
		Username: r.URL.Query().Get("username"),
		Send:     make(chan MessageStruct),
	}

	mutex.Lock()
	clients[client] = true
	utils.Log("INFO", "New Client is Connected to GroupChat")
	mutex.Unlock()

	go ReadMessages(client)
	go Writemessages(client)

}

func ReadMessages(client *Client) {
	for {
		_, message, err := client.Conn.ReadMessage()
		if err != nil {
			mutex.Lock()
			delete(clients, client)
			mutex.Unlock()
			break
		}
		broadcast <- message
	}
}

func Writemessages(c *Client) {
	for {
		// Grab the next message from the broadcast channel
		message := <-broadcast

		// Send the message to all connected clients
		mutex.Lock()

		for client := range clients {
			fmt.Println("Message sent: ", string(message))

			err := client.Conn.WriteMessage(websocket.TextMessage, message)
			if err != nil {
				client.Conn.Close()
				delete(clients, client)
			}

		}
		mutex.Unlock()
	}
}
