package realTime

import (
	"database/sql"
	"fmt"

	"socialNetwork/utils"
)

func DispatchNotificationToUser(toUserID string, notif MessageStruct) {
	mutex.Lock()
	client, ok := clients[toUserID]
	mutex.Unlock()

	if ok {
		utils.Log("INFO", "Sent notification via WS to " + toUserID)
		client.Send <- notif
	} else {
		utils.Log("INFO", "User " + toUserID + " not connected, notification saved to DB")
	}
}


func BuildAndDispatchNotification(db *sql.DB, senderID, receiverID, notifType, content string) {
	if senderID == "" || receiverID == "" || senderID == receiverID {
		return
	}

	sender, err := getSenderInfo(db, senderID)
	if err != nil {
		utils.Log("ERROR", "Failed to fetch sender info: "+err.Error())
		sender.FirstName = "Someone"
		sender.LastName = ""
		sender.Avatar = ""
	}

	notif := MessageStruct{
		Type: "notification",
		Data: map[string]interface{}{
			"id":      sender.UserID,
			"type":    notifType,
			"content": content,
			"avatar":  sender.Avatar,
			"from":    fmt.Sprintf("%s %s", sender.FirstName, sender.LastName),
			"read":    false,
		},
	}
	SaveNotificationToDB(db, receiverID, sender.UserID, notifType, content)
	DispatchNotificationToUser(receiverID, notif)
}


func getSenderInfo(db *sql.DB, senderID string) (UserProfile, error) {
	var sender UserProfile
	err := db.QueryRow(`
		SELECT id, first_name, last_name, avatar FROM users WHERE id = ?
	`, senderID).Scan(&sender.UserID, &sender.FirstName, &sender.LastName, &sender.Avatar)

	return sender, err
}
