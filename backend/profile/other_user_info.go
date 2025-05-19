package profile

import (
	"net/http"
	"socialNetwork/auth"
	"socialNetwork/user"
	"socialNetwork/utils"
	"strings"
)

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

	// Get target user ID from URL
	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 4 {
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "Invalid user ID",
			Error:   "User ID not provided",
		})
		return
	}
	targetUserId := parts[3]

	// Get target user's profile
	profile, err := getUserProfileData(targetUserId)
	if err != nil {
		utils.SendJSON(w, http.StatusNotFound, utils.JSONResponse{
			Success: false,
			Message: "User not found",
			Error:   err.Error(),
		})
		return
	}

	// Check if current user can view this profile
	canView := currentUserId == targetUserId || profile.ProfileStatus == "public"
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

	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "User profile retrieved successfully",
		Data: map[string]interface{}{
			"Data": profile,
		},
	})
}
