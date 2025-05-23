package profile

import (
	"fmt"
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

	// Check if already following
	var exists int
	err = db.DB.QueryRow(`
		SELECT COUNT(*) FROM followers WHERE follower_id = ? AND followed_id = ?
	`, followerId, targetUserId).Scan(&exists)
	if err != nil {
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Database error",
			Error:   err.Error(),
		})
		return
	}

	// Check if a follow request already exists
	var requestExists int
	err = db.DB.QueryRow(`
		SELECT COUNT(*) FROM follow_requests WHERE sender_id = ? AND receiver_id = ?
	`, followerId, targetUserId).Scan(&requestExists)
	if err != nil {
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Database error",
			Error:   err.Error(),
		})
		return
	}

	// Get profile status (public or private)
	var profileStatus string
	err = db.DB.QueryRow(`
		SELECT profile_status FROM users WHERE id = ?
	`, targetUserId).Scan(&profileStatus)
	if err != nil {
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Database error",
			Error:   err.Error(),
		})
		return
	}

	if exists > 0 {
		// Unfollow case: remove from followers table
		_, err = db.DB.Exec(`
			DELETE FROM followers WHERE follower_id = ? AND followed_id = ?
		`, followerId, targetUserId)
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
				"isFollowing":    false,
				"requestPending": false,
			},
		})
		fmt.Println("Unfollow")
		return
	}

	if requestExists > 0 {
		_, err = db.DB.Exec(`
			DELETE FROM follow_requests WHERE sender_id = ? AND receiver_id = ?
		`, followerId, targetUserId)
		if err != nil {
			utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
				Success: false,
				Message: "Error cancelling follow request",
				Error:   err.Error(),
			})
			return
		}
		utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
			Success: true,
			Message: "Follow request cancelled",
			Data: map[string]interface{}{
				"isFollowing":    false,
				"requestPending": false,
			},
		})
		fmt.Println("Cancelled follow request")
		return
	}

	if profileStatus == "private" {
		_, err = db.DB.Exec(`
			INSERT INTO follow_requests (sender_id, receiver_id) VALUES (?, ?)
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
			Data: map[string]interface{}{
				"isFollowing":    false,
				"requestPending": true,
			},
		})
		fmt.Println("Follow request sent")
		return
	}

	_, err = db.DB.Exec(`
		INSERT INTO followers (follower_id, followed_id) VALUES (?, ?)
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
		Message: "Successfully followed user",
		Data: map[string]interface{}{
			"isFollowing":    true,
			"requestPending": false,
		},
	})
	fmt.Println("Followed user directly")
}
