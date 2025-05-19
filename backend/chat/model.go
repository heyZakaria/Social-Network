package chat

import "github.com/gorilla/websocket"

type Message struct {
	ChatID         string `json:"chat_id"`
	SenderID       string `json:"sender_id"`
	ReceiverID     string `json:"receiver_id"`
	MessageContent string `json:"message_content"`
	CreatedAt      string `json:"created_at"`
}

type UserConnections struct {
	UserID   string
	UserName string
	Conn     *websocket.Conn
}
