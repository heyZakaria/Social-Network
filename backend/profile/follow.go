package profile

import (
	"net/http"
	"socialNetwork/auth"
	db "socialNetwork/db/sqlite"
	"socialNetwork/user"
	"socialNetwork/utils"
	"strings"
)

// FollowUser handles follow requests
func FollowUser(w http.ResponseWriter, r *http.Request) {
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

	// Get user to follow from URL
	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 4 {
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "Invalid user ID",
			Error:   "User ID not provided",
		})
		return
	}
	userToFollowId := parts[3]

	// Add follow relationship
	_, err = db.DB.Exec(`
        INSERT INTO followers (follower_id, following_id) 
        VALUES (?, ?)`, followerId, userToFollowId)
	if err != nil {
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Error following user",
			Error:   err.Error(),
		})
		return
	}

	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "Successfully followed user",
		Data: map[string]interface{}{
			"isFollowing": true,
		},
	})
}
