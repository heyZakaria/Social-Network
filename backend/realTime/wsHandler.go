package realTime

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"

	"socialNetwork/auth"
	db "socialNetwork/db/sqlite"
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
	go handleRead(client)

	// === 5. Load and send stored notifications ===
	go sendStoredNotifications(userID, client)
}

func handleWrite(client *Client) {
	for msg := range client.Send {
		client.Conn.WriteJSON(msg)
	}
}

func handleRead(client *Client) {
	defer func() {
		client.Conn.Close()
		mutex.Lock()
		delete(clients, client.UserID)
		mutex.Unlock()
	}()

	for {
		_, msg, err := client.Conn.ReadMessage()
		if err != nil {
			return
		}

		var incoming MessageStruct
		if err := json.Unmarshal(msg, &incoming); err != nil {
			continue
		}

		// Handle private messages
		if incoming.Type == "private_message" {
			if toID, ok := incoming.Data["to"].(string); ok {
				SendNotification(toID, MessageStruct{
					Type: "private_message",
					Data: map[string]interface{}{
						"from":    client.UserID,
						"message": incoming.Data["message"],
					},
				})
			}
		}
		// You can add more handlers for other message types here if needed
	}
}

func SendNotification(toUserID string, notif MessageStruct) {
	// 🟢 Save to DB ALWAYS
	saveNotificationToDB(toUserID, notif)

	// 🔵 If connected, also send via WebSocket
	mutex.Lock()
	client, ok := clients[toUserID]
	mutex.Unlock()

	if ok {
		utils.Log("INFO", "Sent notification via WS to "+toUserID)
		client.Send <- notif
	} else {
		utils.Log("INFO", "User "+toUserID+" not connected, notification saved to DB")
	}
}

func saveNotificationToDB(userID string, notif MessageStruct) {
	jsonData, err := json.Marshal(notif)
	if err != nil {
		utils.Log("ERROR", "Failed to marshal notification: "+err.Error())
		return
	}

	_, err = db.DB.Exec(`
		INSERT INTO notifications (user_id, payload, is_read)
		VALUES (?, ?, 0)
	`, userID, string(jsonData))
	if err != nil {
		utils.Log("ERROR", "Failed to insert notification into DB: "+err.Error())
	}
}

func sendStoredNotifications(userID string, client *Client) {
	rows, err := db.DB.Query(`
		SELECT id, payload FROM notifications
		WHERE user_id = ? AND is_read = 0
	`, userID)
	if err != nil {
		utils.Log("ERROR", "Failed to query stored notifications: "+err.Error())
		return
	}
	defer rows.Close()

	for rows.Next() {
		var id int
		var payload string
		if err := rows.Scan(&id, &payload); err == nil {
			var msg MessageStruct
			if err := json.Unmarshal([]byte(payload), &msg); err == nil {
				client.Send <- msg
			}
		}
	}
}
