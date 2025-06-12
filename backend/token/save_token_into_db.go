package token

import (
	db "socialNetwork/db/sqlite"
)

func SaveToken(userID string, token string) error {
	// Check for old sessions and delete them
	deleteQuery := "DELETE FROM sessions WHERE user_id = ?"
	_, err := db.DB.Exec(deleteQuery, userID)
	if err != nil {
		//TODO Handle The error
		return err // Handle the error appropriately
	}

	// Insert the new session
	insertQuery := `
		INSERT INTO sessions (user_id, token)
		VALUES (?, ?)
	`
	_, err = db.DB.Exec(insertQuery, userID, token)
	return err
}
