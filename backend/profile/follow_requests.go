package profile

import (
	"net/http"

	db "socialNetwork/db/sqlite"
	shared "socialNetwork/shared_packages"
	"socialNetwork/utils"
)


//
func updateFriendRequest(userID, friendID, query string) error {
	_, err := db.DB.Exec(query, userID, friendID)
	if err != nil {
		utils.Log("ERROR", err.Error())
	}
	return err
}

func handleFriendRequest(w http.ResponseWriter, r *http.Request, query, successMsg, failMsg, selfMsg string) {
	userID := r.Context().Value(shared.UserIDKey).(string)
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
			Message: selfMsg,
			Error:   "You cannot accept or reject your own request",
		})
		return
	}
	if err := updateFriendRequest(userID, friendID, query); err != nil {
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: failMsg,
			Error:   err.Error(),
		})
		return
	}
	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		 Message: successMsg,
		})
}

func AcceptFollowRequest(w http.ResponseWriter, r *http.Request) {
	handleFriendRequest(
		w, r,
		`UPDATE followers SET follower_status = 'accepted' WHERE followed_id = ? AND follower_id = ? AND follower_status = 'pending'`,
		"Friend request accepted successfully",
		"Failed to accept friend request",
		"You cannot accept your own request",
	)
}

func RejectFollowRequest(w http.ResponseWriter, r *http.Request) {
	handleFriendRequest(
		w, r,
		`DELETE FROM followers WHERE followed_id = ? AND follower_id = ? AND follower_status = 'pending'`,
		"Friend request rejected successfully",
		"Failed to reject friend request",
		"You cannot reject your own request",
	)
}
