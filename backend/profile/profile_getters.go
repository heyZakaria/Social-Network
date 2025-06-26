package profile

import (
	"fmt"
	"net/http"

	db "socialNetwork/db/sqlite"
	Shared_Profile "socialNetwork/profile_shared"
	shared "socialNetwork/shared_packages"
	"socialNetwork/utils"
)

// GetUserProfile gets the current user's profile
func GetUserProfile(w http.ResponseWriter, r *http.Request) {
	val := r.Context().Value(shared.UserIDKey)
	UserId, ok := val.(string)
	if !ok || UserId == "" {
		utils.Log("WARN", "Unauthorized: user ID missing")
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: "Unauthorized: user ID missing",
			Error:   "User ID not found in context",
		})
		return
	}
	profile, err := Shared_Profile.GetUserProfileData(UserId)
	if err != nil {
		utils.Log("ERROR", "Error fetching profile: "+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Error fetching profile",
			Error:   err.Error(),
		})
		return
	}

	followers, err := LoadUsers(queryFollowers, false, UserId)
	if err != nil {
		utils.Log("ERROR", "Failed to load followers: "+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Failed to load followers",
			Error:   err.Error(),
		})
		return
	}

	profile.Followers = followers

	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "User profile retrieved successfully",
		Data: map[string]interface{}{
			"Data": profile,
		},
	})
}

func GetOtherUserProfile(w http.ResponseWriter, r *http.Request) {
	utils.Log("INFO", "=========== GetOtherUserProfile called ===========")
	currentUserId := r.Context().Value(shared.UserIDKey).(string)

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

	profile, err := Shared_Profile.GetUserProfileData(targetUserID)
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
	profile.Followers, err = LoadUsers(queryFollowers, false, targetUserID)
	if err != nil {
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Failed to load followers",
			Error:   err.Error(),
		})
		return
	}

	// Load following
	profile.Following, err = LoadUsers(queryFollowing, false, targetUserID)
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
		switch status {
		case "accepted":
			profile.IsFollowing = true
		case "pending":
			profile.RequestPending = true
		}
	} else {
		profile.IsFollowing = false
		profile.RequestPending = false
	}
	var ShowMessageButton bool
	err = db.DB.QueryRow(`SELECT EXISTS(SELECT 1 FROM followers WHERE (follower_id = ?
        AND followed_id = ?) OR (follower_id = ?
        AND followed_id = ?) AND follower_status = 'accepted');`, profile.UserID, currentUserId, currentUserId, profile.UserID).Scan(&ShowMessageButton)
	if (err != nil) || ShowMessageButton == false {
		profile.ShowMessage = false
	} else {
		profile.ShowMessage = true
	}
	fmt.Println("ShowMessageButton value", ShowMessageButton)
	utils.Log("INFO", "Profile returned successfully")

	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "User profile retrieved successfully",
		Data: map[string]any{
			"Data": profile,
		},
	})
}
