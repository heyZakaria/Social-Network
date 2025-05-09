package user

import (
	db "socialNetwork/db/sqlite"
	"time"
)

func SaveToken(userID string, token string) error {
	// Check for old sessions and delete them
	deleteQuery := "DELETE FROM sessions WHERE user_id = ?"
	_, err := db.DB.Exec(deleteQuery, userID)
	if err != nil {
		return err // Handle the error appropriately
	}

	// Insert the new session
	insertQuery := `
		INSERT INTO sessions (user_id, token, expiration_time)
		VALUES (?, ?, ?)
	`
	expirationTime := time.Now().Add(24 * time.Hour)
	_, err = db.DB.Exec(insertQuery, userID, token, expirationTime)
	return err
}
