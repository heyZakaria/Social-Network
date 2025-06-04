package profile

import (
	"fmt"
	"net/http"

	db "socialNetwork/db/sqlite"
	shared "socialNetwork/shared_packages"
	"socialNetwork/utils"
)

// GetUserProfile gets the current user's profile
func GetUserProfile(w http.ResponseWriter, r *http.Request) {
	UserId := r.Context().Value(shared.UserIDKey).(string)
	fmt.Println("Inside GetUserProfile, UserId:", UserId)
	profile, err := getUserProfileData(UserId)
	fmt.Println("Profile data retrieved:", profile)
	if err != nil {
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Error fetching profile",
			Error:   err.Error(),
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

// Helper function to get user profile data
func getUserProfileData(userId string) (*UserProfile, error) {
	profile := &UserProfile{UserID: userId}

	// Get basic user info
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
	db.DB.QueryRow("SELECT COUNT(*) FROM followers WHERE followed_id = ?", userId).Scan(&profile.FollowerCount)
	db.DB.QueryRow("SELECT COUNT(*) FROM followers WHERE follower_id = ?", userId).Scan(&profile.FollowingCount)

	return profile, nil
}
