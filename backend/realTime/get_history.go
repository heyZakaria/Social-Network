package realTime

import (
	"fmt"
	"net/http"
	db "socialNetwork/db/sqlite"
	shared "socialNetwork/shared_packages"
	"socialNetwork/utils"
)

func Get_Chat_History(w http.ResponseWriter, r *http.Request) {
	// Get Current USER
	UserID := r.Context().Value(shared.UserIDKey).(string)
	// Get Session ID
	Session_ID := r.URL.Query().Get("session_id")
	if Session_ID == "" {
		utils.Log("ERROR", "No Session id Provided: ")
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "No session id provided",
		})
		return
	}
	// Get Send And recived from Chat Table using Session ID
	var Exist bool
	err := db.DB.QueryRow(`SELECT EXISTS(SELECT 1 FROM chats WHERE sender_id = ? 
		OR receiver_id = ? AND session_id = ? LIMIT 1)`,
		UserID, UserID, Session_ID).Scan(&Exist)
	if err != nil || !Exist {
		utils.Log("ERROR", "Error Trying in Get_Chat_History Handler sessionID: "+Session_ID)
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "No messages yet. Start the conversation!",
		})
		return
	}

	var Messages []MessageStruct
	var res = "|" + Session_ID + "|"
	fmt.Println("fetch_messages: Fetching messages for session ID:", res)
	rows, err := db.DB.Query(`SELECT id, sender_id, receiver_id, message_content, 
				message_type, created_at FROM chats WHERE session_id = ?`, Session_ID)
	if err != nil {
		utils.Log("ERROR", "Error fetching messages from database: "+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Error occured, Please try again later",
		})
	}
	defer rows.Close()
	for rows.Next() {
		var msg MessageStruct
		err = rows.Scan(&msg.ID, &msg.Sender, &msg.Receiver, &msg.Content, &msg.Type, &msg.CreatedAt)
		if err != nil {
			utils.Log("ERROR", "Error scanning row: "+err.Error())
			continue
		}
		Messages = append(Messages, msg)
	}
	utils.Log("INFO", "Chat History Fetched successfully :D")
	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "Chat History Fetched successfully",
		Data: map[string]any{
			"Messages": Messages,
		},
	})
}
