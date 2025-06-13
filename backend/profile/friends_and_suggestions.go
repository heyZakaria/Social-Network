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
	var isOwnProfile bool

	queryID := r.URL.Query().Get("id")
	if queryID != "" {
		userID = queryID
	} else {
		userID = r.Context().Value(shared.UserIDKey).(string)
		isOwnProfile = true
	}

	var requests []User
	var err error
	if isOwnProfile {
		requests, err = LoadUsers(queryPendingRequests, false, userID)
		if err != nil {
			utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
				Success: false,
				Message: "Failed to get pending requests",
				Error:   err.Error(),
			})
			return
		}
	}

	suggestions, err := LoadUsers(querySuggestions, true, userID, userID, userID)
	if err != nil {
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Failed to get suggestions",
			Error:   err.Error(),
		})
		return
	}

	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "Friends and requests fetched",
		Data: map[string]interface{}{
			"requests":    requests,
			"suggestions": suggestions,
		},
	})
}

func LoadUsers(query string, hasNick bool, args ...interface{}) ([]User, error) {
	rows, err := db.DB.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var u User
		if hasNick {
			err = rows.Scan(&u.ID, &u.FirstName, &u.LastName, &u.Avatar, &u.NickName)
		} else {
			err = rows.Scan(&u.ID, &u.FirstName, &u.LastName, &u.Avatar)
		}
		if err == nil {
			users = append(users, u)
		}
	}
	return users, nil
}
