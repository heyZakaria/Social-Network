package User_db

import (
	db "socialNetwork/db/sqlite"
	"time"
)

func SaveToken(userID string, token string) error {
	// TODO Check Old Sessions, replace delete
	query := `
		INSERT INTO sessions (user_id, token, expiration_time)
		VALUES (?, ?, ?)
	`
	expirationTime := time.Now().Add(24 * time.Hour)
	_, err := db.DB.Exec(query, userID, token, expirationTime)
	return err
}
