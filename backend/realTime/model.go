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
    UserID   string // for wsHandler.go
    Username string // for groupChat.go
    Send     chan MessageStruct
}

type MessageStruct struct {
    Type string                 `json:"Type"`
    Data map[string]interface{} `json:"Data"`
}

type JSONRequest struct {
    RealTimeType     string `json:"type"`
    NotificationType string `json:"notif_type"` // check this just if the RealTimeType == "Notification"
}

type UserProfile struct {
	UserID    string
	FirstName string
	LastName  string
	Avatar    string
}
