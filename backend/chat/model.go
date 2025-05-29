package chat

import (
	"fmt"

	db "socialNetwork/db/sqlite"

	"github.com/gorilla/websocket"
)

type Message struct {
	ChatSessionID  string `json:"chat_session_id"`
	SenderID       string `json:"sender_id"`
	ReceiverID     string `json:"receiver_id"`
	MessageContent string `json:"message_content"`
	CreatedAt      string `json:"created_at"`
}

type UserConnections struct {
	Messages Message
	Conn     *websocket.Conn
}

// TODO Implement the InsertMessage function to insert a message into the database
func (message Message) InsertMessage() (err error) {
	_, err = db.DB.Exec("INSERT INTO chats (chat_session_id, sender_id, receiver_id, message_content) VALUES (?, ?, ?, ?)",
		message.ChatSessionID,
		message.SenderID,
		message.ReceiverID,
		message.MessageContent,
	)
	return
}

func (message Message) SendMessageToUser() error {
	for _, user := range UserConnection[message.ReceiverID] {
		err := user.Conn.WriteJSON(message)
		if err != nil {
			fmt.Println("Error sending message:", err)
			return err
		}
		return nil
	}
	fmt.Println("No connection found for chat session ID:", message.ChatSessionID)
	return fmt.Errorf("no connection found for chat session ID: %s", message.ChatSessionID)
}

// GetMessagesHistory retrieves the chat history for a given chat session ID with pagination support.
func GetMessagesHistory(chatSessionID string, offset int) (messages []Message, err error) {
	stmnt, err := db.DB.Prepare("SELECT * FROM chats WHERE chat_session_id = ? ORDER BY created_at ASC LIMIT 10 OFFSET ?")
	if err != nil {
		fmt.Println("Error Prepare statment:", err)
		return nil, err
	}
	defer stmnt.Close()

	rows, err := stmnt.Query(chatSessionID, offset)
	if err != nil {
		fmt.Println("Error Executing query:", err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var msg Message
		err = rows.Scan(&msg.ChatSessionID, &msg.SenderID, &msg.ReceiverID, &msg.MessageContent, &msg.CreatedAt)
		if err != nil {
			fmt.Println("Error scanning row:", err)
			continue // TODO or handle the error as needed
		}
		messages = append(messages, msg)
	}
	if err = rows.Err(); err != nil {
		fmt.Println("Error in rows:", err)
		return nil, err
	}
	return messages, nil
}
