package realTime

import "github.com/gorilla/websocket"

type GroupMessage struct {
	Group_id  int    `json:"group_id"`
	Message   string `json:"message"`
	Sender_id string `json:"user_id"`
	CreatedAt string `json:"created_at"`
}

type Client struct {
	Conn     *websocket.Conn
	Username string
	Send     chan MessageStruct
}

type MessageStruct struct {
	Sender   string `json:"sender"`
	Receiver string `json:"receiver"`
	Content  string `json:"content"`
	Type     string `json:"type"`
}
 
type JSONRequest struct {
	SocketType RealTimeType `json:"type"`
	// Data  string `json:"data"` // for ex: chat message but there is a question?
}


type RealTimeType struct {
	Type string `json:"type"`
} 
