package profile

import (
	"net/http"

	"socialNetwork/auth"
	db "socialNetwork/db/sqlite"
	"socialNetwork/user"
	"socialNetwork/utils"
)

func AcceptFriendRequest(userID, friendID string) error {
	_, err := db.DB.Exec(`
		UPDATE followers
		SET follower_status = 'accepted'
		WHERE followed_id = ? AND follower_id = ? AND follower_status = 'pending'
	`, userID, friendID)
	if err != nil {
		utils.Log("ERROR", "Failed to accept friend request: "+err.Error())
		return err
	}
	utils.Log("INFO", "Friend request accepted successfully")
	return nil
}

func RejectFriendRequest(userID, friendID string) error {
	_, err := db.DB.Exec(`
		DELETE FROM followers
		WHERE followed_id = ? AND follower_id = ? AND follower_status = 'pending'
	`, userID, friendID)
	if err != nil {
		utils.Log("ERROR", "Failed to reject friend request: "+err.Error())
		return err
	}
	utils.Log("INFO", "Friend request rejected successfully")
	return nil
}

func AcceptFollowRequest(w http.ResponseWriter, r *http.Request) {
	token := auth.GetToken(w, r)
	userID, err := user.GetUserIDByToken(token)
	if err != nil {
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: "Please login to continue",
			Error:   "You are not authorized",
		})
		return
	}
	friendID := r.URL.Query().Get("id")
	if friendID == "" {
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "Friend ID is required",
			Error:   "Missing 'id' query parameter",
		})
		return
	}
	if friendID == userID {
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "You cannot accept your own request",
		})
		return
	}
	err = AcceptFriendRequest(userID, friendID)
	if err != nil {
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Failed to accept friend request",
			Error:   err.Error(),
		})
		return
	}
	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "Friend request accepted successfully",
		Data:    nil,
	})
}

func RejectFollowRequest(w http.ResponseWriter, r *http.Request) {
	token := auth.GetToken(w, r)
	userID, err := user.GetUserIDByToken(token)
	if err != nil {
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: "Please login to continue",
			Error:   "You are not authorized",
		})
		return
	}
	friendID := r.URL.Query().Get("id")
	if friendID == "" {
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "Friend ID is required",
			Error:   "Missing 'id' query parameter",
		})
		return
	}
	if friendID == userID {
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "You cannot reject your own request",
		})
		return
	}
	err = RejectFriendRequest(userID, friendID)
	if err != nil {
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Failed to reject friend request",
			Error:   err.Error(),
		})
		return
	}
	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "Friend request rejected successfully",
		Data:    nil,
	})
}