package notifications

import (
	"database/sql"
	"fmt"
	"time"

	db "socialNetwork/db/sqlite"
	"socialNetwork/utils"
)

func DispatchNotificationToUser(toUserID string, notif MessageStruct) {
	mutex.Lock()
	client, ok := clients[toUserID]
	mutex.Unlock()

	if ok {
		utils.Log("INFO", "Sent notification via WS to "+toUserID)
		client.Send <- notif
	} else {
		utils.Log("INFO", "User "+toUserID+" not connected, notification saved to DB")
	}
}

func BuildAndDispatchNotification(
	db *sql.DB,
	inviteID int64,
	senderID, receiverID, notifType, content, groupID string,
	eventID int,
) {
	if senderID == "" || receiverID == "" || senderID == receiverID {
		return
	}

	sender, err := getSenderInfo(db, senderID)
	if err != nil {
		utils.Log("ERROR", "Failed to fetch sender info: "+err.Error())
		sender.FirstName, sender.LastName, sender.Avatar = "Someone", "", ""
	}

	notifID, err := SaveNotificationToDB(db, receiverID, senderID, notifType, content, groupID, eventID, inviteID)
	if err != nil {
		utils.Log("ERROR", "DB insert/update: "+err.Error())
		return
	}

	notif := MessageStruct{
		Type: "notification",
		Data: map[string]interface{}{
			"invitedId": inviteID,
			"notifId":   notifID,
			"id":        sender.UserID,
			"type":      notifType,
			"content":   content,
			"avatar":    sender.Avatar,
			"from":      fmt.Sprintf("%s %s", sender.FirstName, sender.LastName),
			"read":      false,
			"createdAt": time.Now().Format(time.RFC3339),
			"group_id":  groupID,
			"event_id":  eventID,
		},
	}
	DispatchNotificationToUser(receiverID, notif)
}

func getSenderInfo(db *sql.DB, senderID string) (UserProfile, error) {
	var sender UserProfile
	err := db.QueryRow(`
		SELECT id, first_name, last_name, avatar FROM users WHERE id = ?
	`, senderID).Scan(&sender.UserID, &sender.FirstName, &sender.LastName, &sender.Avatar)

	return sender, err
}

func DeleteFollowRequestNotification(userID, senderID, notifType string, InviteId int64) {
	res, err := db.DB.Exec(`
		DELETE FROM notifications 
		WHERE user_id = ? AND sender_id = ? AND type_notification = ? AND invite_id = ?
	`, userID, senderID, notifType, InviteId)
	if err != nil {
		utils.Log("ERROR", "Failed to delete notification: "+err.Error())
		return
	}
	if rows, _ := res.RowsAffected(); rows == 0 {
		utils.Log("WARN", "No notification matched for deletion")
	} else {
		utils.Log("INFO", "Notification deleted from db")
	}
}
