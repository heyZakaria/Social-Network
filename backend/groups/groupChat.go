package Group

import (
	"fmt"
	"net/http"
	"socialNetwork/utils"
	"sync"

	"github.com/gorilla/websocket"
)

type Client struct {
	Conn     *websocket.Conn
	Username string
	Send     chan PrivateMessageStruct
}

type PrivateMessageStruct struct {
	Sender   string `json:"sender"`
	Receiver string `json:"receiver"`
	Content  string `json:"content"`
	Type     string `json:"type"`
}

var clients = make(map[*Client]bool)
var broadcast = make(chan []byte)
var mutex = &sync.Mutex{}

// websocket upgrader
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func GroupChat(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		utils.Log("ERROR", "Failed to upgrade connection to websocket: "+err.Error())

		return
	}
	utils.Log("INFO", "Connected to websocket")
	// get token then get username from db

	client := &Client{
		Conn:     conn,
		Username: r.URL.Query().Get("username"),
		Send:     make(chan PrivateMessageStruct),
	}

	mutex.Lock()
	clients[client] = true
	utils.Log("INFO", "Client added to map")
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
