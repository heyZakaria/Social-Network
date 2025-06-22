package realTime

import (
	"database/sql"
)

func SaveNotificationToDB(db *sql.DB, userID, senderID, notifType, content string) (int64, error) {
	//  upsert
	_, err := db.Exec(`
		INSERT INTO notifications (user_id, sender_id, type_notification, content, is_read, created_at)
		VALUES (?, ?, ?, ?, 0, CURRENT_TIMESTAMP)
		ON CONFLICT(user_id, sender_id, type_notification, content)
		DO UPDATE SET
			is_read = 0,
			created_at = CURRENT_TIMESTAMP
	`, userID, senderID, notifType, content)

	if err != nil {
		return 0, err
	}

	var notifID int64
	err = db.QueryRow(`
		SELECT id FROM notifications
		WHERE user_id = ? AND sender_id = ? AND type_notification = ? AND content = ?
	`, userID, senderID, notifType, content).Scan(&notifID)

	if err != nil {
		return 0, err
	}

	return notifID, nil
}
