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
	UserID := r.Context().Value("UserID").(string)
	if err != nil {
		utils.Log("ERROR", "Failed to upgrade connection to websocket: "+err.Error())

		return
	}
	utils.Log("INFO", "Connected to websocket")
	// get token then get username from db

	client := &Client{
		Conn:   conn,
		UserID: UserID,
		Send:   make(chan MessageStruct),
	}

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
		GroupChat(*client, conn, r)
	case "private_message":

	}
}
