package chat

import (
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
	Chat_List := r.URL.Query().Get("chat_list")
	var Messages []MessageStruct

	if Chat_List == "fetch" {
		// Get The Chat List
		var shouldReturn bool
		Messages, shouldReturn = Get_Recent_Chat(UserID, w, Messages)
		if shouldReturn {
			return
		}
		utils.Log("INFO", "Chat USERS List Fetched successfully")
		utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
			Success: true,
			Message: "Chat List Fetched successfully",
			Data: map[string]any{
				"ChatList": Messages,
			},
		})
		return
	}

	if Session_ID == "" {
		utils.Log("ERROR", "No Session id Provided: ")
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "No session id provided",
		})
		return
	}

	// Check if the session ID is for a group chat
	var Exists bool

	db.DB.QueryRow(`SELECT EXISTS(SELECT 1 FROM group_chat WHERE session_id = ? LIMIT 1)`, Session_ID).Scan(&Exists)
	//Get Chat History for Group Chat
	if Exists {
		Messages = Get_History_Of_Chat_Group(Session_ID, w, Messages)
		return
	}

	// Check if the session ID exists in the chats table
	err := db.DB.QueryRow(`SELECT EXISTS(SELECT 1 FROM chats WHERE sender_id = ? 
		OR receiver_id = ? AND session_id = ? LIMIT 1)`,
		UserID, UserID, Session_ID).Scan(&Exists)
	if err != nil || !Exists {
		utils.Log("ERROR", "Error Trying in Get_Chat_History Handler sessionID: "+Session_ID)
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "No messages yet. Start the conversation!",
		})
		return
	}

	Messages, shouldReturn := Get_History_Of_Personal_Chat(Session_ID, w, Messages, UserID)
	if shouldReturn {
		return
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
