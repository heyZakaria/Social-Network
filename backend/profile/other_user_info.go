package profile

import (
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

	// Load followers
	profile.Followers, err = LoadUsers(profile.UserID, "accepted")
	if err != nil {
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Failed to load followers",
			Error:   err.Error(),
		})
		return
	}

	// Load following
	profile.Following, err = GetFollowing(profile.UserID)
	if err != nil {
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Failed to load following",
			Error:   err.Error(),
		})
		return
	}

	// Determine if user can view profile
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

	// Determine if it's own profile
	profile.IsOwnProfile = currentUserId == profile.UserID
	if profile.IsOwnProfile {
		utils.Log("INFO", "User is viewing their own profile")
	}

	// Check follow status between currentUser and targetUser
	var status string
	err = db.DB.QueryRow(`
		SELECT follower_status FROM followers
		WHERE follower_id = ? AND followed_id = ?
	`, currentUserId, profile.UserID).Scan(&status)

	if err == nil {
		if status == "accepted" {
			profile.IsFollowing = true
		} else if status == "pending" {
			profile.RequestPending = true
		}
	} else {
		profile.IsFollowing = false
		profile.RequestPending = false
	}

	utils.Log("INFO", "Profile returned successfully")
	profile.FollowerCount = len(profile.Followers)
	profile.FollowingCount = len(profile.Following)

	

	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "User profile retrieved successfully",
		Data: map[string]interface{}{
			"Data": profile,
		},
	})
}
