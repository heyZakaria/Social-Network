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
	Chat_List := r.URL.Query().Get("chat_list")

	if Chat_List == "fetch" {
		// Get The Chat List
		Query := `SELECT 
					c.*,
					u.id AS other_user_id,
					u.first_name,
					u.last_name,
					u.avatar
				FROM chats c
				JOIN users u ON u.id = 
					CASE 
						WHEN c.sender_id = ? THEN c.receiver_id
						ELSE c.sender_id
					END
				WHERE (c.sender_id = ? OR c.receiver_id = ?)
				AND c.created_at IN (
					SELECT MAX(created_at)
					FROM chats
					WHERE sender_id = ? OR receiver_id = ?
					GROUP BY 
						CASE 
							WHEN sender_id = ? THEN receiver_id
							ELSE sender_id
						END
				)
				ORDER BY c.created_at DESC;
	          `
		rows, err := db.DB.Query(Query, UserID, UserID, UserID, UserID, UserID, UserID)
		if err != nil {
			utils.Log("ERROR", "Error fetching chat list from database: "+err.Error())
			utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
				Success: false,
				Message: "Error occured, Please try again later",
				Error:   err.Error(),
			})
			return
		}
		defer rows.Close()

		var ChatList []MessageStruct
		for rows.Next() {
			var item MessageStruct
			if err := rows.Scan(&item.ID, &item.SessionID, &item.Sender, &item.Receiver, &item.Content, &item.Readed, &item.Type, &item.CreatedAt, &item.Other_user_id, &item.Other_first_name, &item.Other_last_name, &item.Other_avatar); err != nil {
				utils.Log("ERROR", "Error scanning row: "+err.Error())
				continue
			}
			db.DB.QueryRow(`SELECT COUNT(*) FROM chats WHERE session_id = ? AND message_readed = 0 AND receiver_id = ?`, item.SessionID, UserID).Scan(&item.Readed)
			ChatList = append(ChatList, item)
		}
		utils.Log("INFO", "Chat USERS List Fetched successfully")
		utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
			Success: true,
			Message: "Chat List Fetched successfully",
			Data: map[string]any{
				"ChatList": ChatList,
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

	_, err = db.DB.Exec("UPDATE chats SET message_readed = 1 WHERE session_id = ? AND receiver_id = ?", Session_ID, UserID)
	if err != nil {
		utils.Log("ERROR", "Error marking messages as read: "+err.Error())
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
