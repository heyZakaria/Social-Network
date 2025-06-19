package realTime

import (
	"database/sql"

	"socialNetwork/utils"
)

func SaveNotificationToDB(db *sql.DB, userID, senderID, notifType, content string) {
	_, err := db.Exec(`
		INSERT INTO notifications (user_id, sender_id, type_notification, content, is_read)
		VALUES (?, ?, ?, ?, 0)
	`, userID, senderID, notifType, content)
	if err != nil {
		utils.Log("ERROR", "Failed to insert notification into DB: "+err.Error())
	}
}
