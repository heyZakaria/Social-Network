package notifications

import (
	"database/sql"
	"time"

	db "socialNetwork/db/sqlite"
	"socialNetwork/utils"
)

func SendStoredNotifications(userID string, client *Client) {
	rows, err := db.DB.Query(`
        SELECT id, sender_id, type_notification, content, invite_id, created_at
        FROM notifications
        WHERE user_id = ? 
        ORDER BY created_at ASC
    `, userID)
	if err != nil {
		utils.Log("ERROR", "Failed to query stored notifications: "+err.Error())
		return
	}
	defer rows.Close()

	for rows.Next() {
		var (
			notifID                      int64
			senderID, notifType, content string
			inviteID                     sql.NullInt64
			createdAt                    time.Time
		)

		if err := rows.Scan(&notifID, &senderID, &notifType, &content, &inviteID, &createdAt); err != nil {
			utils.Log("ERROR", "Failed to scan: "+err.Error())
			continue
		}

		sender, err := getSenderInfo(db.DB, senderID)
		if err != nil {
			sender.FirstName, sender.LastName, sender.Avatar = "Someone", "", ""
		}

		msg := MessageStruct{
			Type: "notification",
			Data: map[string]interface{}{
				"invitedId": func() int64 {
					if inviteID.Valid {
						return inviteID.Int64
					}
					return 0
				}(),
				"notifId":   notifID,
				"id":        senderID,
				"type":      notifType,
				"content":   content,
				"avatar":    sender.Avatar,
				"from":      sender.FirstName + " " + sender.LastName,
				"createdAt": createdAt.Format(time.RFC3339),
			},
		}

		client.Send <- msg
	}
}

func BroadcastNotification(db *sql.DB, senderID string, receiverIDs []string, notifType, content string) {
	for _, receiverID := range receiverIDs {
		BuildAndDispatchNotification(db, 0, senderID, receiverID, notifType, content)
	}
}

// users := []string{"user1", "user2", "user3"}
// notification.BroadcastNotification(db.DB, "admin", users, "event", "Server Update", "We'll be back soon!")

func GetInviteID(db *sql.DB, senderID, receiverID, groupID string) (int64, error) {
	var inviteID int64
	err := db.QueryRow(`
		SELECT id FROM group_invite
		WHERE sender_id = ? AND reciever_id = ? AND group_id = ?
	`, senderID, receiverID, groupID).Scan(&inviteID)

	return inviteID, err
}
