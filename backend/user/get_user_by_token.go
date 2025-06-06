package user

import (
	"fmt"
	"time"

	db "socialNetwork/db/sqlite"
	"socialNetwork/utils"
)

// GetUserIDByToken retrieves the user ID associated with a given token.
func GetUserIDByToken(token string) (string, error) {
	var userID string
	var expirationTime time.Time

	if token == "" {
		utils.Log("ERROR", "Token is empty")
		return "", fmt.Errorf("Token is empty")
	}
	stmnt, err := db.DB.Prepare("SELECT user_id, expiration_time FROM sessions WHERE token = ?")
	if err != nil {
		utils.Log("ERROR", "Error preparing statement: "+err.Error())
		return "", err
	}
	defer stmnt.Close()

	err = stmnt.QueryRow(token).Scan(&userID, &expirationTime)
	if err != nil {
		utils.Log("ERROR", "Error executing query: "+err.Error())
		return "", fmt.Errorf("Please login first.")
	}

	// Check if the token has expired
	if time.Now().After(expirationTime) {
		utils.Log("ERROR", "Token has expired")
		return "", fmt.Errorf("Token has expired")
	}
	return userID, nil
}
