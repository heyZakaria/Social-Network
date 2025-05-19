package profile

import (
	"fmt"
	"net/http"

	"socialNetwork/auth"
	"socialNetwork/user"
	"socialNetwork/utils"
)

type userInfo struct {
	User_id string `json:"user_id"`
}

// GetOtherUserProfile gets another user's profile
func GetOtherUserProfile(w http.ResponseWriter, r *http.Request) {
	// Get current user ID from token
	token := auth.GetToken(w, r)
	currentUserId, err := user.GetUserIDByToken(token)
	if err != nil {
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: "Please login to continue",
			Error:   "You are not Authorized.",
		})
		return
	}
	targetUserId := userInfo{}
	targetUserId.User_id = r.URL.Query().Get("id")
	fmt.Println("targetUserId===========>", targetUserId.User_id)
	// Get target user's profile
	profile, err := getUserProfileData(targetUserId.User_id)
	if err != nil {
		utils.SendJSON(w, http.StatusNotFound, utils.JSONResponse{
			Success: false,
			Message: "User not found",
			Error:   err.Error(),
		})
		return
	}

	// Check if current user can view this profile
	canView := currentUserId == targetUserId.User_id || profile.ProfileStatus == "public"
	if !canView {
		// Check if follower
		for _, follower := range profile.Followers {
			if follower.ID == currentUserId {
				canView = true
				break
			}
		}
	}

	if !canView {
		utils.SendJSON(w, http.StatusForbidden, utils.JSONResponse{
			Success: false,
			Message: "This account is private",
			Error:   "You must follow this user to view their profile",
		})
		return
	}
	profile.IsOwnProfile = currentUserId == targetUserId.User_id

	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "User profile retrieved successfully",
		Data: map[string]interface{}{
			"Data": profile,
		},
	})
}
