package realTime_Chat

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
	var Messages []MessageStruct

	if Chat_List == "fetch" {
		// Get The Chat List
		rows, err := db.DB.Query(Get_Recent_Chats, UserID, UserID, UserID, UserID, UserID, UserID)
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

		for rows.Next() {
			var item MessageStruct
			if err := rows.Scan(&item.ID, &item.SessionID, &item.Sender, &item.Receiver, &item.Content, &item.Readed, &item.CreatedAt, &item.Other_user_id, &item.Other_first_name, &item.Other_last_name, &item.Other_avatar); err != nil {
				utils.Log("ERROR", "Error scanning row: "+err.Error())
				continue
			}
			db.DB.QueryRow(`SELECT COUNT(*) FROM chats WHERE session_id = ? AND message_readed = 0 AND receiver_id = ?`, item.SessionID, UserID).Scan(&item.Readed)
			Messages = append(Messages, item)
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
	var Exists bool

	db.DB.QueryRow(`SELECT EXISTS(SELECT 1 FROM group_chat WHERE session_id = ? LIMIT 1)`, Session_ID).Scan(&Exists)
	fmt.Println("Request to fetch messages for session ID:", Session_ID, "and for chatList:", Chat_List)
	fmt.Println("Exists:", Exists)
	if Exists {
		fmt.Println("fetch_messages for Chat group session ID:", Session_ID)
		rows, err := db.DB.Query(`SELECT 
				c.*,
				users.first_name AS sender_first_name,
				users.last_name AS sender_last_name,
				users.avatar AS sender_avatar
				FROM group_chat c
				JOIN users ON c.sender_id = users.id
				WHERE c.session_id = ?;
			`, Session_ID)
		if err != nil {
			utils.Log("ERROR", "Error fetching messages from database for CHATGROUP: "+err.Error())
			utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
				Success: false,
				Message: "Error occured, Please try again later",
			})
			return
		}
		defer rows.Close()
		for rows.Next() {
			var msg MessageStruct
			err = rows.Scan(&msg.ID, &msg.SessionID, &msg.Sender, &msg.GroupID, &msg.Content, &msg.CreatedAt, &msg.Other_first_name, &msg.Other_last_name, &msg.Other_avatar)
			if err != nil {
				utils.Log("ERROR", "Error scanning row: "+err.Error())
				continue
			}
			Messages = append(Messages, msg)
		}
		utils.Log("INFO", "GroupCHAT History Fetched successfully :D")
		utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
			Success: true,
			Message: "GroupCHAT History Fetched successfully",
			Data: map[string]any{
				"Messages": Messages,
			},
		})
		return
	}

	//////////////////////////////////////////////////////////////////////////////////////////

	// Get Send And recived from Chat Table using Session ID
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

	rows, err := db.DB.Query(`SELECT * FROM chats WHERE session_id = ?`, Session_ID)
	if err != nil {
		utils.Log("ERROR", "Error fetching messages from database: "+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Error occured, Please try again later",
		})
		return
	}
	defer rows.Close()
	for rows.Next() {
		var msg MessageStruct
		err = rows.Scan(&msg.ID, &msg.SessionID, &msg.Sender, &msg.Receiver, &msg.Content, &msg.Readed, &msg.CreatedAt)
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