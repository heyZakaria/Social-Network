package middleware

import (
	"fmt"
	"net/http"
	db "socialNetwork/db/sqlite"
	"socialNetwork/utils"
	"time"
)

type JSONResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message,omitempty"`
	Error   string `json:"error,omitempty"`
	Token   string `json:"token,omitempty"`
}

func GetToken(w http.ResponseWriter, r *http.Request) (token string) {
	token = r.Header.Get("Authorization")
	if token == "" {
		utils.Log("ERROR", "Authorization header is missing in GetToken Handler")
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: "Authorization header is missing",
			Error:   "You are not Authorized.",
		})
		return
	}

	// Extract the token value from "Bearer <token>"
	if len(token) > 7 && token[:7] == "Bearer " {
		token = token[7:]
	} else {
		utils.Log("ERROR", "Invalid Authorization header format in CheckUserExeting Handler")
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: "Invalid Authorization header format",
			Error:   "You are not Authorized.",
		})
		return
	}
	return
}

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
