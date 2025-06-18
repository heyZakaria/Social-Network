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
	ID               int		`json:"id"`
	Sender           string     `json:"sender"`
	Receiver         string     `json:"receiver"`
	Content          string     `json:"content"`
	Type             string     `json:"type"`
	FirstTime        bool       `json:"first_time"`
	SessionID        string     `json:"session_id"`
	CreatedAt        *time.Time `json:"createdAt"`
	Other_user_id    string     `json:"other_user_id"`
	Other_first_name string     `json:"other_first_name"`
	Other_last_name  string     `json:"other_last_name"`
	Other_avatar     string     `json:"other_avatar"`
}

type JSONRequest struct {
	RealTimeType     string `json:"type"`
	NotificationType string `json:"notif_type"` // check this just if the RealTimeType == "Notification"

}
