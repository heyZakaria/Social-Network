package profile

import (
	"net/http"

	"socialNetwork/auth"
	db "socialNetwork/db/sqlite"
	"socialNetwork/user"
	"socialNetwork/utils"
)

func ToggleFollowUser(w http.ResponseWriter, r *http.Request) {
	token := auth.GetToken(w, r)
	followerId, err := user.GetUserIDByToken(token)
	if err != nil {
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: "Please login to continue",
			Error:   "You are not authorized",
		})
		return
	}

	targetUserId := r.URL.Query().Get("id")
	if targetUserId == "" {
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "User ID is required",
			Error:   "Missing 'id' query parameter",
		})
		return
	}

	if targetUserId == followerId {
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "You cannot follow/unfollow yourself",
		})
		return
	}

	// Get profile status
	var profileStatus string
	err = db.DB.QueryRow(`SELECT profile_status FROM users WHERE id = ?`, targetUserId).Scan(&profileStatus)
	if err != nil {
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Database error",
			Error:   err.Error(),
		})
		return
	}

	// Check current follow status
	var followerStatus string
	err = db.DB.QueryRow(`
		SELECT follower_status FROM followers WHERE follower_id = ? AND followed_id = ?
	`, followerId, targetUserId).Scan(&followerStatus)

	isFollowing := err == nil && followerStatus == "accepted"
	requestPending := err == nil && followerStatus == "pending"

	if r.Method == http.MethodGet {
		utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
			Success: true,
			Data: map[string]any{
				"isFollowing":    isFollowing,
				"requestPending": requestPending,
			},
		})
		return
	}

	// Handle POST (toggle)
	if isFollowing || requestPending {
		_, err = db.DB.Exec(`
			DELETE FROM followers WHERE follower_id = ? AND followed_id = ?
		`, followerId, targetUserId)
		if err != nil {
			utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
				Success: false,
				Message: "Error removing follow/follow request",
				Error:   err.Error(),
			})
			return
		}
		utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
			Success: true,
			Message: "Unfollowed or request cancelled",
			Data: map[string]any{
				"isFollowing":    false,
				"requestPending": false,
			},
		})
		return
	}

	// Insert follow or request
	if profileStatus == "private" {
		_, err = db.DB.Exec(`
			INSERT INTO followers (follower_id, followed_id, follower_status)
			VALUES (?, ?, 'pending')
		`, followerId, targetUserId)
		if err != nil {
			utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
				Success: false,
				Message: "Error sending follow request",
				Error:   err.Error(),
			})
			return
		}
		utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
			Success: true,
			Message: "Follow request sent",
			Data: map[string]any{
				"isFollowing":    false,
				"requestPending": true,
			},
		})
		return
	}

	// Public profile -> follow directly
	_, err = db.DB.Exec(`
		INSERT INTO followers (follower_id, followed_id, follower_status)
		VALUES (?, ?, 'accepted')
	`, followerId, targetUserId)
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
		Message: "Followed user",
		Data: map[string]any{
			"isFollowing":    true,
			"requestPending": false,
		},
	})
}
