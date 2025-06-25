package chat

import (
	"net/http"
	db "socialNetwork/db/sqlite"
	"socialNetwork/utils"
)

func Get_History_Of_Personal_Chat(Session_ID string, w http.ResponseWriter, Messages []MessageStruct, UserID string) ([]MessageStruct, bool) {
	rows, err := db.DB.Query(`SELECT * FROM chats WHERE session_id = ?`, Session_ID)
	if err != nil {
		utils.Log("ERROR", "Error fetching messages from database: "+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Error occured, Please try again later",
		})
		return nil, true
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
	return Messages, false
}

func Get_Recent_Chat(UserID string, w http.ResponseWriter, Messages []MessageStruct) ([]MessageStruct, bool) {
	rows, err := db.DB.Query(Get_Recent_Chats, UserID, UserID, UserID, UserID, UserID, UserID)
	if err != nil {
		utils.Log("ERROR", "Error fetching chat list from database: "+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Error occured, Please try again later",
			Error:   err.Error(),
		})
		return nil, true
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
	return Messages, false
}

func (msgs *MessageStruct) Private_Chat(UserID string) bool {
	if msgs.Receiver != UserID {
		db.DB.QueryRow(`SELECT chat_session_id FROM chats WHERE sender_id = ? AND receiver_id = ?
			OR receiver_id = ? AND sender_id = ? LIMIT 1`, UserID, msgs.Receiver, UserID, msgs.Receiver).
			Scan(&msgs.SessionID)
		//Generating the session ID
		if msgs.SessionID == "" {
			msgs.FirstTime = true
			utils.Log("INFO", "No existing chat session found, creating a new one")
			msgs.SessionID = utils.GenerateChatSessionID(UserID, msgs.Receiver)
			utils.Log("INFO", "New chat session ID created: "+msgs.SessionID)
		}
		// Save Chat into Database
		shouldReturn, b := msgs.InsertDB(UserID)
		if shouldReturn {
			return b
		}
	}
	return false
}
