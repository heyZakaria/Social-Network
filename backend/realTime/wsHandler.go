package realTime

import (
	"net/http"
	"sync"

	Tkn "socialNetwork/token"
	"socialNetwork/utils"

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

	token := r.URL.Query().Get("token")

	userID, err := Tkn.GetUserIDByToken(token)
	if err != nil {
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: "Invalid token",
		})
		return
	}

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
	go SendStoredNotifications(userID, client)
}

func handleWrite(client *Client) {
	for msg := range client.Send {
		client.Conn.WriteJSON(msg)
	}
}
