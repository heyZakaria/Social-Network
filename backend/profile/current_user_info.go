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

	return profile, nil
}
