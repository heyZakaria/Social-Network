package profile

import (
	"net/http"
	"socialNetwork/auth"
	db "socialNetwork/db/sqlite"
	"socialNetwork/user"
	"socialNetwork/utils"
	"strings"
)

// UnfollowUser handles unfollow requests
func UnfollowUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.SendJSON(w, http.StatusMethodNotAllowed, utils.JSONResponse{
			Success: false,
			Message: "Method not allowed",
			Error:   "Use POST method",
		})
		return
	}

	token := auth.GetToken(w, r)
	followerId, err := user.GetUserIDByToken(token)
	if err != nil {
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: "Please login to continue",
			Error:   "You are not Authorized.",
		})
		return
	}

	// Get user to unfollow from URL
	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 4 {
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "Invalid user ID",
			Error:   "User ID not provided",
		})
		return
	}
	userToUnfollowId := parts[3]

	// Remove follow relationship
	_, err = db.DB.Exec(`
        DELETE FROM followers 
        WHERE follower_id = ? AND following_id = ?`,
		followerId, userToUnfollowId)
	if err != nil {
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Error unfollowing user",
			Error:   err.Error(),
		})
		return
	}

	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "Successfully unfollowed user",
		Data: map[string]interface{}{
			"isFollowing": false,
		},
	})
}
