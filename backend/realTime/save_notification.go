package realTime

import (
	"database/sql"

	"socialNetwork/utils"
)

func SaveNotificationToDB(db *sql.DB, userID, senderID, notifType, content string) {
	_, err := db.Exec(`
		INSERT OR REPLACE INTO notifications (id, user_id, sender_id, type_notification, content, is_read, created_at)
		VALUES (
			COALESCE(
				(SELECT id FROM notifications WHERE user_id = ? AND sender_id = ? AND type_notification = ? AND content = ?),
				NULL
			),
			?, ?, ?, ?, 0, CURRENT_TIMESTAMP
		)
	`, userID, senderID, notifType, content, userID, senderID, notifType, content)
	if err != nil {
		utils.Log("ERROR", "Failed to insert or update notification: "+err.Error())
	}
}
