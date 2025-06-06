package profile

import (
	"database/sql"
	"net/http"

	db "socialNetwork/db/sqlite"
	shared "socialNetwork/context"
	"socialNetwork/utils"
)

func ToggleFollowUser(w http.ResponseWriter, r *http.Request) {
	followerId := r.Context().Value(shared.UserIDKey).(string)
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
	profile := &UserProfile{}

	// Get target user's profile status
	var profileStatus string
	err := db.DB.QueryRow(`SELECT profile_status FROM users WHERE id = ?`, targetUserId).Scan(&profileStatus)
	if err != nil {
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Database error (profile_status)",
			Error:   err.Error(),
		})
		return
	}

	// Check current follow status
	var followerStatus string
	err = db.DB.QueryRow(`
		SELECT follower_status FROM followers WHERE follower_id = ? AND followed_id = ?
	`, followerId, targetUserId).Scan(&followerStatus)

	if err == nil {
		profile.IsFollowing = followerStatus == "accepted"
		profile.RequestPending = followerStatus == "pending"
		profile.CanView = profile.IsFollowing
	} else if err == sql.ErrNoRows {
		profile.IsFollowing = false
		profile.RequestPending = false
	} else {
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Database error (check follow status)",
			Error:   err.Error(),
		})
		return
	}

	if r.Method == http.MethodGet {
		// fmt.Printf("GET Follow Status - Follower: %s, Target: %s, Following: %v, Pending: %v\n",
		// followerId, targetUserId, profile.IsFollowing, profile.RequestPending)
		utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
			Success: true,
			Data: map[string]any{
				"Data": profile,
			},
		})
		return
	}

	// POST (Toggle follow/unfollow)
	if profile.IsFollowing || profile.RequestPending {
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
		profile.IsFollowing = false
		profile.RequestPending = false
		utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
			Success: true,
			Message: "Unfollowed or request cancelled",
			Data: map[string]any{
				"Data": profile,
			},
		})
		return
	}

	// Follow (new request or direct follow)
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
		profile.IsFollowing = false
		profile.RequestPending = true
	} else {
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
		profile.IsFollowing = true
		profile.RequestPending = false
		profile.CanView = true
	}

	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "Follow action completed",
		Data: map[string]any{
			"Data": profile,
		},
	})
}
