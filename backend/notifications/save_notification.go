package notifications

import (
	"database/sql"
	"time"
)

func SaveNotificationToDB(
	db *sql.DB,
	userID, senderID, notifType, content, groupID string,
	eventID int,     // event_id is TEXT in schema, so changed from int to string
	inviteID int64,
) (int64, error) {
	// Normalize inviteID to 0 if negative (or any rule you want)
	if inviteID < 0 {
		inviteID = 0
	}

	// Insert or update notification
	_, err := db.Exec(`
		INSERT INTO notifications 
			(user_id, sender_id, type_notification, content, event_id, group_id, invite_id, is_read, created_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)
		ON CONFLICT(user_id, sender_id, type_notification, content, event_id, group_id, invite_id)
		DO UPDATE SET
			is_read = 0,
			created_at = excluded.created_at
	`, userID, senderID, notifType, content, eventID, groupID, inviteID, time.Now().Format(time.RFC3339))
	if err != nil {
		return 0, err
	}

	// Select the notification ID
	var notifID int64
	err = db.QueryRow(`
		SELECT id FROM notifications
		WHERE user_id = ? AND sender_id = ? AND type_notification = ? AND content = ? AND event_id = ? AND group_id = ? AND invite_id = ?
	`, userID, senderID, notifType, content, eventID, groupID, inviteID).Scan(&notifID)

	return notifID, err
}
