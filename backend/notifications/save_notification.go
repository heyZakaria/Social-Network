package notifications

import (
	"database/sql"
)

func SaveNotificationToDB(
	db *sql.DB,
	userID, senderID, notifType, content string,
	inviteID int64,
) (int64, error) {
	_, err := db.Exec(`
        INSERT INTO notifications (user_id, sender_id, type_notification, content, invite_id, is_read, created_at)
        VALUES (?, ?, ?, ?, ?, 0, CURRENT_TIMESTAMP)
        ON CONFLICT(user_id, sender_id, type_notification, content, IFNULL(invite_id, 0))
        DO UPDATE SET
            is_read   = 0,
            created_at = CURRENT_TIMESTAMP
    `, userID, senderID, notifType, content, inviteID)
	if err != nil {
		return 0, err
	}

	var notifID int64
	err = db.QueryRow(`
        SELECT id FROM notifications
        WHERE user_id = ? AND sender_id = ? AND type_notification = ? AND content = ? AND IFNULL(invite_id, 0) = ?
    `, userID, senderID, notifType, content, inviteID).Scan(&notifID)

	return notifID, err
}
