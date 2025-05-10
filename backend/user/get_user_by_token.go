package user

// CREATE TABLE sessions (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     user_id TEXT NOT NULL,
//     token TEXT NOT NULL,
//     expiration_time TIMESTAMP NOT NULL DEFAULT (DATETIME('now', '+24 hours')),
//     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
// );
import (
	"fmt"
	"net/http"
	db "socialNetwork/db/sqlite"
	"time"
)

// GetUserIDByToken retrieves the user ID associated with a given token.
func GetUserIDByToken(r *http.Request) (string, error) {
	var userID string
	var expirationTime time.Time

	tokenCookie, err := r.Cookie("token")
	if err != nil {
		// TODO Handle error if the cookie is not found
		return "", fmt.Errorf("Error retrieving token cookie")
	}

	token := tokenCookie.Value

	stmnt, err := db.DB.Prepare("SELECT user_id, expiration_time FROM sessions WHERE token = ?")
	if err != nil {
		return "", err
	}
	defer stmnt.Close()

	err = stmnt.QueryRow(token).Scan(&userID, &expirationTime)
	if err != nil {
		return "", fmt.Errorf("Please login first.")
	}

	// Check if the token has expired
	if time.Now().After(expirationTime) {
		return "", fmt.Errorf("Token has expired")
	}

	return userID, nil
}
