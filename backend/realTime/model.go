package realTime

import "github.com/gorilla/websocket"


type Client struct {
    Conn     *websocket.Conn
    UserID   string
    Send     chan MessageStruct
}

type MessageStruct struct {
    Type string                 `json:"Type"`
    Data map[string]interface{} `json:"Data"`
}

type UserProfile struct {
	UserID    string
	FirstName string
	LastName  string
	Avatar    string
}
