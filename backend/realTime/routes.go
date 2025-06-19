package realTime

import (
	"fmt"
	"net/http"
	db "socialNetwork/db/sqlite"
	shared "socialNetwork/shared_packages"
	"socialNetwork/utils"
)

func WebSocketMux() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("/ws", WSHandler)                          // 	/groups/{id}/newEvent
	mux.HandleFunc("GET /Get_Chat_History", Get_Chat_History) // 	/groups/{id}/events
	mux.HandleFunc("GET /set_readed", Set_Message_AS_Readed)
	return mux
}

func Set_Message_AS_Readed(w http.ResponseWriter, r *http.Request) {
	UserID := r.Context().Value(shared.UserIDKey).(string)
	Session_ID := r.URL.Query().Get("session_id")
	fmt.Println("inside+++++++++=====+++ db")
	// Turn all msgs as readed from 0 to 1
	_, err := db.DB.Exec("UPDATE chats SET message_readed = 1 WHERE session_id = ? AND receiver_id = ?", Session_ID, UserID)
	if err != nil {
		utils.Log("ERROR", "Error marking messages as read: "+err.Error())
		utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
			Success: false,
			Message: "Error Setting msgs as readed",
		})
		return
	}
	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "Messages setted as Readed",
	})
}
