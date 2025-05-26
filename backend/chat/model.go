package chat

import (
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
	Conn     []*websocket.Conn
}

// TODO Implement the InsertMessage function to insert a message into the database
func (Connections *UserConnections) InsertMessage(message Message) (err error) {
	_, err = db.DB.Exec("INSERT INTO chats (chat_session_id, sender_id, receiver_id, message_content) VALUES (?, ?, ?, ?)",
		message.ChatSessionID,
		message.SenderID,
		message.ReceiverID,
		message.MessageContent,
	)
	return
}

func GetMessagesHistory(chatSessionID string, offset int) (messages []Message, err error) {
	stmnt, err := db.DB.Prepare("SELECT * FROM chats WHERE chat_session_id = ? ORDER BY created_at ASC LIMIT 10 OFFSET ?")
	if err != nil {
		return nil, err
	}
	defer stmnt.Close()

	rows, err := stmnt.Query(chatSessionID, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var msg Message
		err = rows.Scan(&msg.ChatSessionID, &msg.SenderID, &msg.ReceiverID, &msg.MessageContent, &msg.CreatedAt)
		if err != nil {
			continue //TODO or handle the error as needed
		}
		messages = append(messages, msg)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return messages, nil
}
