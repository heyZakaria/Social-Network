package chat

import (
	"net/http"
	db "socialNetwork/db/sqlite"
	"socialNetwork/utils"
)

func Get_History_Of_Chat_Group(Session_ID string, w http.ResponseWriter, Messages []MessageStruct) []MessageStruct {
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
		return nil
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
	return Messages
}

func (msgs *MessageStruct) Group_Chat(UserID string) bool {
	if msgs.SessionID == "" {
		utils.Log("ERROR", "Session ID is empty for group message")
		return true
	}
	// Save Chat into Database
	shouldReturn, b := msgs.InsertDB(UserID)
	if shouldReturn {
		return b
	}
	return false
}
