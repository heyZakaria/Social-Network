package profile

import (
	"net/http"

	"socialNetwork/auth"
	db "socialNetwork/db/sqlite"
	"socialNetwork/user"
	"socialNetwork/utils"
)

// POST /api/users/follow?id=TARGET_USER_ID
func UsersList(w http.ResponseWriter, r *http.Request) {
	token := auth.GetToken(w, r)
	followerID, err := user.GetUserIDByToken(token)
	if err != nil {
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false, Message: "Unauthorized", Error: err.Error(),
		})
		return
	}

	targetID := r.URL.Query().Get("id")
	if targetID == "" || targetID == followerID {
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false, Message: "Invalid user ID",
		})
		return
	}

	var status string
	err = db.DB.QueryRow(`SELECT profile_status FROM users WHERE id = ?`, targetID).Scan(&status)
	if err != nil {
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false, Message: "User not found", Error: err.Error(),
		})
		return
	}

	var following bool
	err = db.DB.QueryRow(`SELECT EXISTS(SELECT 1 FROM followers WHERE followed_id = ? AND follower_id = ?)`, targetID, followerID).Scan(&following)
	if err != nil {
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{Success: false, Error: err.Error()})
		return
	}

	if following {
		_, err = db.DB.Exec(`DELETE FROM followers WHERE followed_id = ? AND follower_id = ?`, targetID, followerID)
		utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
			Success: true, Message: "Unfollowed", Data: map[string]any{"isFollowing": false, "requestPending": false},
		})
		return
	}

	if status == "private" {
		_, err = db.DB.Exec(`INSERT OR REPLACE INTO followers (followed_id, follower_id, follower_status) VALUES (?, ?, 'pending')`, targetID, followerID)
		utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
			Success: true, Message: "Follow request sent", Data: map[string]any{"isFollowing": false, "requestPending": true},
		})
		return
	}

	_, err = db.DB.Exec(`INSERT INTO followers (followed_id, follower_id, follower_status) VALUES (?, ?, 'accepted')`, targetID, followerID)
	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true, Message: "Now following", Data: map[string]any{"isFollowing": true, "requestPending": false},
	})
}
