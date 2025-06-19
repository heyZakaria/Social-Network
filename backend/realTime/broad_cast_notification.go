package realTime

import (
	"database/sql"

	db "socialNetwork/db/sqlite"
	"socialNetwork/utils"
)

func SendStoredNotifications(userID string, client *Client) {
	rows, err := db.DB.Query(`
		SELECT id, sender_id, type_notification, content, is_read FROM notifications
		WHERE user_id = ? AND is_read = 0
	`, userID)
	if err != nil {
		utils.Log("ERROR", "Failed to query stored notifications: "+err.Error())
		return
	}
	defer rows.Close()

	for rows.Next() {
		var id int
		var senderID, notifType, content string
		var isRead bool

		if err := rows.Scan(&id, &senderID, &notifType, &content, &isRead); err == nil {
			sender, err := getSenderInfo(db.DB, senderID)
			if err != nil {
				sender.FirstName = "Someone"
				sender.LastName = ""
				sender.Avatar = ""
			}

			msg := MessageStruct{
				Type: "notification",
				Data: map[string]interface{}{
					"id":      senderID,
					"type":    notifType,
					"content": content,
					"avatar":  sender.Avatar,
					"from":    sender.FirstName + " " + sender.LastName,
					"read":    isRead,
				},
			}

			client.Send <- msg
		}
	}
}

func BroadcastNotification(db *sql.DB, senderID string, receiverIDs []string, notifType, title, content string) {
	for _, receiverID := range receiverIDs {
		BuildAndDispatchNotification(db, senderID, receiverID, notifType, content)
	}
}

// users := []string{"user1", "user2", "user3"}
// notification.BroadcastNotification(db.DB, "admin", users, "event", "Server Update", "We'll be back soon!")
