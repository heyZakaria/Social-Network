package profile

import (
	"fmt"
	"net/http"

	"socialNetwork/auth"
	db "socialNetwork/db/sqlite"
	"socialNetwork/user"
	"socialNetwork/utils"
)

func GetOtherUserProfile(w http.ResponseWriter, r *http.Request) {
	utils.Log("INFO", "=========== GetOtherUserProfile called ===========")

	token := auth.GetToken(w, r)
	currentUserId, err := user.GetUserIDByToken(token)
	if err != nil {
		utils.Log("ERROR", "Unauthorized access attempt: "+err.Error())
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: "Please login to continue",
			Error:   "You are not Authorized.",
		})
		return
	}
	utils.Log("INFO", "Authenticated user ID: "+currentUserId)

	targetUserID := r.URL.Query().Get("id")
	if targetUserID == "" {
		utils.Log("WARN", "Missing 'id' query parameter")
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "Missing user ID",
			Error:   "Query parameter 'id' is required",
		})
		return
	}
	utils.Log("INFO", "Requested profile for user ID: "+targetUserID)

	profile, err := getUserProfileData(targetUserID)
	if err != nil {
		utils.Log("ERROR", "Failed to get profile data: "+err.Error())
		utils.SendJSON(w, http.StatusNotFound, utils.JSONResponse{
			Success: false,
			Message: "User not found",
			Error:   err.Error(),
		})
		return
	}

	profile.Followers, err = LoadUsers(profile.UserID, "accepted")
	if err != nil {
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Failed to load followers",
			Error:   err.Error(),
		})
		return
	}

	profile.CanView = currentUserId == profile.UserID || profile.ProfileStatus == "public"
	if !profile.CanView {
		for _, follower := range profile.Followers {
			if follower.ID == currentUserId {
				profile.CanView = true
				utils.Log("INFO", "User is a follower and can view the profile")
				break
			}
		}
	}

	profile.IsOwnProfile = currentUserId == profile.UserID
	if profile.IsOwnProfile {
		utils.Log("INFO", "User is viewing their own profile")
	}

	utils.Log("INFO", "Profile returned successfully")

	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "User profile retrieved successfully",
		Data: map[string]interface{}{
			"Data": profile,
		},
	})
}

func LoadUsers(userID string, status string) ([]User, error) {
	rows, err := db.DB.Query(`
		SELECT users.id, users.first_name, users.last_name, users.avatar
		FROM followers
		JOIN users ON users.id = followers.follower_id
		WHERE followers.followed_id = ? AND followers.follower_status = ?
	`, userID, status)
	if err != nil {
		utils.Log("ERROR", "Failed to load followers: "+err.Error())
		return nil, err
	}
	defer rows.Close()

	var followers []User
	for rows.Next() {
		var follower User
		if err := rows.Scan(&follower.ID, &follower.FirstName, &follower.LastName, &follower.Avatar); err != nil {
			utils.Log("ERROR", "Error scanning follower: "+err.Error())
			continue
		}
		followers = append(followers, follower)
	}
	utils.Log("INFO", fmt.Sprintf("Loaded %d followers with status '%s'", len(followers), status))
	return followers, nil
}

