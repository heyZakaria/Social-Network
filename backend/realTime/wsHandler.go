package realTime

import (
	"fmt"
	"net/http"
	"sync"

	"socialNetwork/auth"
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

	// === 1. Read token from query ===
	token := r.URL.Query().Get("token")
	if token == "" {
		utils.Log("ERROR", "Missing token in query")
		conn.Close()
		return
	}
	fmt.Println("Token from query:", token)

	// === 2. Validate token and get userID ===
	userID, err := auth.VerifyJWT(token)
	if err != nil {
		utils.Log("ERROR", "Invalid token: "+err.Error())
		conn.Close()
		return
	}
	fmt.Println("User ID from token:", userID)

	// === 3. Create client and register ===
	client := &Client{
		Conn:   conn,
		UserID: userID,
		Send:   make(chan MessageStruct),
	}

	mutex.Lock()
	clients[userID] = client
	mutex.Unlock()

	// === 4. Start goroutines ===
	go handleWrite(client)

	// === 5. Load and send stored notifications ===
	go SendStoredNotifications(userID, client)
}

func handleWrite(client *Client) {
	for msg := range client.Send {
		client.Conn.WriteJSON(msg)
	}
}
