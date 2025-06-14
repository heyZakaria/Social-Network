package realTime

import (
	"fmt"
	"net/http"
	"socialNetwork/utils"
	"sync"

	"github.com/gorilla/websocket"
)

var clients = make(map[string]*Client)
var broadcast = make(chan MessageStruct)
var mutex = &sync.Mutex{}

func GroupChat(client Client, conn *websocket.Conn, r *http.Request) {

	mutex.Lock()
	clients[client.UserID] = &client
	utils.Log("INFO", "Client added to map")
	mutex.Unlock()

	go ReadMessages(client.UserID)
	go Writemessages(client.UserID)

}

func ReadMessages(UserID string) {
	msgs := MessageStruct{}
	for {
		err := clients[UserID].Conn.ReadJSON(&msgs)
		if err != nil {
			mutex.Lock()
			delete(clients, UserID)
			mutex.Unlock()
			break
		}
		broadcast <- msgs
	}
}

func Writemessages(UserID string) {
	for {
		// Grab the next message from the broadcast channel
		message := <-broadcast

		// Send the message to all connected clients
		mutex.Lock()

		fmt.Println("Message sent: ", message.Content)

		err := clients[UserID].Conn.WriteJSON(message)
		if err != nil {
			clients[UserID].Conn.Close()
			delete(clients, UserID)
		}

		mutex.Unlock()
	}
}
