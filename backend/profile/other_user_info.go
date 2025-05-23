package profile

import (
	"fmt"
	"net/http"

	"socialNetwork/auth"
	"socialNetwork/user"
	"socialNetwork/utils"
)

// GetOtherUserProfile gets another user's profile
func GetOtherUserProfile(w http.ResponseWriter, r *http.Request) {
	fmt.Println("===========GetOtherUserProfile===============")
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
	profile := &UserProfile{}
	profile.UserID = r.URL.Query().Get("id")
	fmt.Println("profile===========>", profile.UserID)
	// Get target user's profile
	profile, err = getUserProfileData(profile.UserID)
	if err != nil {
		utils.SendJSON(w, http.StatusNotFound, utils.JSONResponse{
			Success: false,
			Message: "User not found",
			Error:   err.Error(),
		})
		return
	}


	// Check if current user can view this profile
	profile.CanView = currentUserId == profile.UserID || profile.ProfileStatus == "public"
	if !profile.CanView {
		// Check if follower
		for _, follower := range profile.Followers {
			if follower.ID == profile.UserID {
				profile.CanView = true
				break
			}
		}
	}

	fmt.Println("profile===========>", profile)
	fmt.Println("")
	profile.IsOwnProfile = currentUserId == profile.UserID

	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "User profile retrieved successfully",
		Data: map[string]interface{}{
			"Data": profile,
		},
	})
}
