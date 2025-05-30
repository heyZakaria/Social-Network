package profile

import (
	// "fmt"
	"net/http"

	db "socialNetwork/db/sqlite"
	shared "socialNetwork/shared_packages"
	"socialNetwork/utils"
)

func GetFriendsAndRequests(w http.ResponseWriter, r *http.Request) {
	utils.Log("", "GetFriendsAndRequests called")
	var userID string
	var err error
	var isOwnProfile bool = false

	queryID := r.URL.Query().Get("id")
	if queryID != "" {
		userID = queryID
	} else {
		userID = r.Context().Value(shared.UserIDKey).(string)

		isOwnProfile = true
	}
	// fmt.Printf("User ID: %s, Is Own Profile: %t\n", userID, isOwnProfile)

	friends, err := LoadUsers(userID, "accepted")
	if err != nil {
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Failed to get friends",
			Error:   err.Error(),
		})
		return
	}

	var requests []User
	if isOwnProfile {
		requests, err = LoadUsers(userID, "pending")
		if err != nil {
			utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
				Success: false,
				Message: "Failed to get pending requests",
				Error:   err.Error(),
			})
			return
		}
	}
	// fmt.Printf("Friends: %v, Requests: %v\n", friends, requests)

	/////////////////////////

	rows, err := db.DB.Query(`
        SELECT id, first_name, last_name, avatar, nickname
        FROM users
        WHERE id != ? AND id NOT IN (
            SELECT followed_id FROM followers WHERE follower_id = ?
            UNION
            SELECT follower_id FROM followers WHERE followed_id = ?
        )
        LIMIT 10
    `, userID, userID, userID)
	if err != nil {
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Failed to get suggestions",
			Error:   err.Error(),
		})
		return
	}
	defer rows.Close()

	var suggestions []User
	for rows.Next() {
		var u User
		err := rows.Scan(&u.ID, &u.FirstName, &u.LastName, &u.Avatar, &u.NickName)
		if err == nil {
			suggestions = append(suggestions, u)
		}
	}
	// fmt.Printf("Suggestions: %v\n", suggestions)

	/////////////////////////

	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "Friends and requests fetched",
		Data: map[string]interface{}{
			"friends":     friends,
			"requests":    requests,
			"suggestions": suggestions,
		},
	})
}