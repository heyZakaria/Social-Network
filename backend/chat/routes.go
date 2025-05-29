package chat

import (
	"net/http"

	"socialNetwork/auth"
	"socialNetwork/user"
	"socialNetwork/utils"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

func ChatMux() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/wsChat", WebSocketHandler)
	mux.HandleFunc("GET /history", MessagesHistory)
	return mux
}

// Chat Table in Database:
// CREATE TABLE IF NOT EXISTS chats(
//
//	chat_id INTEGER PRIMARY KEY,
//	sender_id TEXT NOT NULL,
//	receiver_id TEXT NOT NULL,
//	message_content TEXT NOT NULL,
//	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//	FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
//	FOREIGN KEY (receiver_id) REFERENCES users(usera_id) ON DELETE CASCADE
//
// ) NO ROWID;
var upgrader = websocket.Upgrader{
	CheckOrigin:     func(r *http.Request) bool { return true },
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

var UserConnection = make(map[string][]UserConnections)

func WebSocketHandler(w http.ResponseWriter, r *http.Request) {
	// Write Full Logic of How to handle Chat Between users step by step
	// 1. Check if the user is authenticated
	token := auth.GetToken(w, r)
	if token == "" {
		// TODO Handle The error
		utils.Log("INFO", "User is not authenticated")
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: "User is not authenticated",
		})
		return
	}
	// Check if the token is valid
	UserID, err := user.GetUserIDByToken(token)
	if err != nil {
		return
	}

	// 2. Upgrade the connection to a WebSocket
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, "Failed to upgrade connection", http.StatusInternalServerError)
		return
	}
	defer conn.Close()

	// 4. Save the message to the database
	// 5. Send a response back to the client
	// 6. Handle disconnection
	// 7. Close the connection
	// 8. Handle errors
	// 9. Send messages to the client

	// Handle WebSocket connection for chat
	// This function will be implemented in the next step
	// For now, we will just send a message back to the client
	// Upgrade the connection to a WebSocket

	// we have to listend to all requests from the client
	// 	and save all connnections in a map with theier user id
	// and then we can send messages to the clien

	// Listen for messages from the client

	// Create a new user connection if it doesn't exist
	uc := UserConnections{
		Conn: conn,
	}
	if con, exist := UserConnection[UserID]; exist {
		// If the user already has a connection, append the new connection
		UserConnection[UserID] = append(con, uc)
	} else {
		// If the user doesn't have a connection, create a new slice
		UserConnection[UserID] = []UserConnections{uc}
	}
	// Log the creation of a new user connection
	utils.Log("INFO", "Creating new user connection for user: "+UserID)
	for {
		var msg Message
		err := conn.ReadJSON(&msg)
		if err != nil {
			break
		}
		// if the user its first time to send a message we have to create a new chat session
		if msg.ChatSessionID == "" {
			// Create a new chat session ID
			msg.ChatSessionID = uuid.New().String()
		}
		// Set the sender and receiver IDs
		if msg.SenderID == "" {
			msg.SenderID = UserID // Use the authenticated user's ID as the sender
		}
		if msg.ReceiverID == "" {
			// TODO Handle the case where the receiver ID is not provided
			http.Error(w, "Receiver ID is required", http.StatusBadRequest)
			return
		}
		// Log the received message
		utils.Log("INFO", "Received message from user: "+msg.SenderID+" to user: "+msg.ReceiverID)
		// Prepare the SQL statement to insert the message
		// Handle the message (e.g., save it to the database)
		msg.InsertMessage()
		// Send a response back to the client
		msg.SendMessageToUser()
		err = conn.WriteMessage(websocket.TextMessage, []byte("Message received"))
		if err != nil {
			break
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": "WebSocket connection established"}`))
}

func MessagesHistory(w http.ResponseWriter, r *http.Request) {
	// Handle fetching chat history
	// This function will be implemented in the next step
	// For now, we will just send a message back to the client
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": "Chat history fetched"}`))
}
