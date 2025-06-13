package profile

import (
	"net/http"

	db "socialNetwork/db/sqlite"
	shared "socialNetwork/shared_packages"
	"socialNetwork/utils"
)

// GetUserProfile gets the current user's profile
func GetUserProfile(w http.ResponseWriter, r *http.Request) {
	UserId := r.Context().Value(shared.UserIDKey).(string)
	profile, err := getUserProfileData(UserId)
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

// Helper function to get user profile data
func getUserProfileData(userId string) (*UserProfile, error) {
	profile := &UserProfile{UserID: userId}
	err := db.DB.QueryRow(`
        SELECT first_name, last_name, email, nickname, bio, avatar, 
               profile_status, birthday, created_at 
        FROM users 
        WHERE id = ?`, userId).Scan(
		&profile.FirstName, &profile.LastName, &profile.Email,
		&profile.NickName, &profile.Bio, &profile.Avatar,
		&profile.ProfileStatus, &profile.Birthday, &profile.CreatedAt)
	if err != nil {
		return nil, err
	}
	db.DB.QueryRow("SELECT COUNT(*) FROM posts WHERE user_id = ?", userId).Scan(&profile.PostsCount)
	db.DB.QueryRow("SELECT COUNT(*) FROM followers WHERE followed_id = ? AND follower_status = 'accepted'", userId).Scan(&profile.FollowerCount)
	db.DB.QueryRow("SELECT COUNT(*) FROM followers WHERE follower_id = ? AND follower_status = 'accepted'", userId).Scan(&profile.FollowingCount)

	return profile, nil
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

	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "User profile retrieved successfully",
		Data: map[string]interface{}{
			"Data": profile,
		},
	})
}
