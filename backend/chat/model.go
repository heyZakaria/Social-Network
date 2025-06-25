package chat

import (
	db "socialNetwork/db/sqlite"
	"socialNetwork/utils"
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
	ID               int        `json:"id"`
	Sender           string     `json:"sender"`
	GroupID          string     `json:"group_id"`
	Receiver         string     `json:"receiver"`
	Content          string     `json:"content"`
	Type             string     `json:"type"`
	FirstTime        bool       `json:"first_time"`
	SessionID        string     `json:"session_id"`
	Readed           int        `json:"readed"`
	CreatedAt        *time.Time `json:"createdAt"`
	Other_user_id    string     `json:"other_user_id"`
	Other_first_name string     `json:"other_first_name"`
	Other_last_name  string     `json:"other_last_name"`
	Other_avatar     string     `json:"other_avatar"`
	Token            string     `json:"token"`
}

func (msgs *MessageStruct) InsertDB(UserID string) (bool, bool) {

	stmnt, err := db.DB.Prepare(Insert_queries[msgs.Type])
	if err != nil {
		utils.Log("ERROR", "Error preparing statement: "+err.Error())
		return true, true
	}
	defer stmnt.Close()

	var Receiver string
	if msgs.Type == "private_message" {
		Receiver = msgs.Receiver
	} else {
		Receiver = msgs.GroupID
	}
	// Execute the statement with the provided parameters
	_, err = stmnt.Exec(msgs.SessionID, UserID, Receiver, msgs.Content)
	if err != nil {
		utils.Log("ERROR", "Error inserting group message into database: "+err.Error())
		return true, true
	}

	return false, false
}
