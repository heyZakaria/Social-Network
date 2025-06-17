package realTime

import (
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

type GroupMessage struct {
	Group_id  int    `json:"group_id"`
	Message   string `json:"message"`
	Sender_id string `json:"user_id"`
	CreatedAt string `json:"created_at"`
}

type Client struct {
	Conn      *websocket.Conn
	UserID    string
	Broadcast chan MessageStruct
	Mutex     *sync.Mutex
}
type MessageStruct struct {
	ID        int
	Sender    string     `json:"sender"`
	Receiver  string     `json:"receiver"`
	Content   string     `json:"content"`
	Type      string     `json:"type"`
	FirstTime bool       `json:"first_time"`
	SessionID string     `json:"session_id"`
	CreatedAt *time.Time `json:"createdAt"`
}

type JSONRequest struct {
	RealTimeType     string `json:"type"`
	NotificationType string `json:"notif_type"` // check this just if the RealTimeType == "Notification"

}
