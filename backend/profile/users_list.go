package profile

import (
	"fmt"
	"net/http"

	"socialNetwork/auth"
	db "socialNetwork/db/sqlite"
	"socialNetwork/user"
	"socialNetwork/utils"
)

func GetFriendsAndRequests(w http.ResponseWriter, r *http.Request) {
	utils.Log("INFO", "GetFriendsAndRequests called")

	token := auth.GetToken(w, r)
	userID, err := user.GetUserIDByToken(token)
	if err != nil {
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: "Unauthorized",
			Error:   err.Error(),
		})
		return
	}
	friends, err := LoadUsers(userID, "accepted")
	if err != nil {
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Failed to get friends",
			Error:   err.Error(),
		})
		return
	}
	fmt.Println("friends", friends)
	// friends = []User{
	// 	{ID: "2", FirstName: "Test", LastName: "Friend", NickName: "tester", Avatar: ""},
	// 	{ID: "3", FirstName: "Pending", LastName: "User", NickName: "", Avatar: ""},
	// 	{ID: "3", FirstName: "Pending", LastName: "User", NickName: "", Avatar: ""},
	// 	{ID: "3", FirstName: "Pending", LastName: "User", NickName: "", Avatar: ""},
	// 	{ID: "3", FirstName: "Pending", LastName: "User", NickName: "", Avatar: ""},
	// }
	// fmt.Println("friends", friends)

	// Query pending requests
	requests, err := LoadUsers(userID, "pending")
	// requests = []User{
	// 	{ID: "3", FirstName: "Pending", LastName: "User", NickName: "", Avatar: ""},
	// 	{ID: "3", FirstName: "Pending", LastName: "User", NickName: "", Avatar: ""},
	// 	{ID: "3", FirstName: "Pending", LastName: "User", NickName: "", Avatar: ""},
	// 	{ID: "3", FirstName: "Pending", LastName: "User", NickName: "", Avatar: ""},
	// }
	// fmt.Println("requests", requests)

	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "Friends and requests fetched",
		Data: map[string]interface{}{
			"friends":  friends,
			"requests": requests,
		},
	})
}

func GetUserSuggestions(w http.ResponseWriter, r *http.Request) {
	utils.Log("INFO", "GetUserSuggestions called")

	token := auth.GetToken(w, r)
	userID, err := user.GetUserIDByToken(token)
	if err != nil {
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: "Unauthorized",
			Error:   err.Error(),
		})
		return
	}

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

	var users []User
	for rows.Next() {
		var u User
		err := rows.Scan(&u.ID, &u.FirstName, &u.LastName, &u.Avatar, &u.NickName)
		if err == nil {
			users = append(users, u)
		}
	}

	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "Suggestions fetched",
		Data: map[string]interface{}{
			"users": users,
		},
	})
}
