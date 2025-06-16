package realTime

import (
	"fmt"
	"net/http"
	"socialNetwork/utils"

	"github.com/gorilla/websocket"
)

// websocket upgrader
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func WSHandler(w http.ResponseWriter, r *http.Request) {
	UserID := r.Header.Get("UserID")
	fmt.Println("UserID from context aciba:", UserID)
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		utils.Log("ERROR", "Failed to upgrade connection to websocket: "+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Failed to upgrade connection to websocket",
		})
		return
	}
	if UserID == "" {
		utils.Log("ERROR", "UserID not found in request context")
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: "Please login to continue",
			Error:   "Login required",
		})
		return
	}
	utils.Log("INFO", "Connected to websocket")

	client := &Client{
		Conn:      conn,
		UserID:    UserID,
		Broadcast: make(chan MessageStruct),
	}

	mutex.Lock()
	clients[UserID] = client
	utils.Log("INFO", "Client added to map")
	mutex.Unlock()

	go ReadMessages(UserID)
	go WriteMessages(UserID)

}
