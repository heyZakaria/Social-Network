package realTime

import (
	"database/sql"
	"fmt"
	"time"

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

func BuildAndDispatchNotification(db *sql.DB, senderID, receiverID, notifType, content string) {
	if senderID == "" || receiverID == "" || senderID == receiverID {
		return
	}
	sender, err := getSenderInfo(db, senderID)
	if err != nil {
		utils.Log("ERROR", "Failed to fetch sender info: "+err.Error())
		sender.FirstName, sender.LastName, sender.Avatar = "Someone", "", ""
	}
	notifID, err := SaveNotificationToDB(db, receiverID, senderID, notifType, content)
	if err != nil {
		utils.Log("ERROR", "DB insert/update: "+err.Error())
		return
	}
	notif := MessageStruct{
		Type: "notification",
		Data: map[string]interface{}{
			"notifId":   notifID,
			"id":        sender.UserID,
			"type":      notifType,
			"content":   content,
			"avatar":    sender.Avatar,
			"from":      fmt.Sprintf("%s %s", sender.FirstName, sender.LastName),
			"read":      false,
			"createdAt": time.Now().Format(time.RFC3339),
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