package realTime

import (
	"net/http"
	"socialNetwork/utils"

	"github.com/gorilla/websocket"
)

// websocket upgrader
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func WSHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		utils.Log("ERROR", "Failed to upgrade connection to websocket: "+err.Error())

		return
	}
	utils.Log("INFO", "Connected to websocket")
	// get token then get username from db

	client := &Client{
		Conn:     conn,
		Username: r.URL.Query().Get("username"),
		Send:     make(chan MessageStruct),
	}

	mutex.Lock()
	clients[client] = true
	utils.Log("INFO", "Client added to map")
	mutex.Unlock()

	var JR JSONRequest

	switch JR.RealTimeType {
	case "notification":
		switch JR.NotificationType {
		case "follow":
			
		case "invite":

		case "private_message":
		
		case "group_message":

		}

	case "group_chat":
		GroupChat(conn, r)
	case "private_message":

	}
}
