package token

import (
	db "socialNetwork/db/sqlite"
)

func SaveToken(userID string, token string) error {
	// Check for old sessions and delete them
	err := DeleteSession(userID)
	if err != nil {
		return err
	}

	// Insert the new session
	insertQuery := `
		INSERT INTO sessions (user_id, token)
		VALUES (?, ?)
	`
	_, err = db.DB.Exec(insertQuery, userID, token)
	return err
}

func DeleteSession(userID string) (error) {
	deleteQuery := "DELETE FROM sessions WHERE user_id = ?"
	_, err := db.DB.Exec(deleteQuery, userID)
	if err != nil {
		//TODO Handle The error
		return err // Handle the error appropriately
	}
	return nil
}
