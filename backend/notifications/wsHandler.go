package notifications

import (
	"net/http"
	"sync"

	"socialNetwork/utils"

	shared "socialNetwork/shared_packages"

	"github.com/gorilla/websocket"
)

var (
	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool { return true },
	}
	clients = make(map[string]*Client) // userID -> *Client
	mutex   sync.Mutex
)

func WSHandler(w http.ResponseWriter, r *http.Request) {

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		utils.Log("ERROR", "Failed to upgrade: "+err.Error())
		return
	}

	userID := r.Context().Value(shared.UserIDKey).(string)
	client := &Client{
		Conn:   conn,
		UserID: userID,
		Send:   make(chan MessageStruct),
	}

	mutex.Lock()
	if existing, ok := clients[userID]; ok {
		existing.Conn.Close()
		delete(clients, userID)
	}
	clients[userID] = client
	mutex.Unlock()

	go handleWrite(client)
	go handleRead(client)
	go SendStoredNotifications(userID, client)
}

func handleWrite(client *Client) {
	for msg := range client.Send {
		client.Conn.WriteJSON(msg)
	}
}

func handleRead(client *Client) {
	defer client.Conn.Close()
	for {
		if _, _, err := client.Conn.NextReader(); err != nil {
			break
		}
	}
}
