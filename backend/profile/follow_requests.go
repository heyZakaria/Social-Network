package profile

import (
	"fmt"
	"net/http"

	db "socialNetwork/db/sqlite"
	"socialNetwork/realTime"
	shared "socialNetwork/shared_packages"
	"socialNetwork/utils"
)

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


func RejectFollowRequest(w http.ResponseWriter, r *http.Request) {
	handleFriendRequest(
		w, r,
		`DELETE FROM followers WHERE followed_id = ? AND follower_id = ? AND follower_status = 'pending'`,
		"Friend request rejected successfully",
		"Failed to reject friend request",
		"You cannot reject your own request",
	)
}

func AcceptFollowRequest(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(shared.UserIDKey).(string)
	friendID := r.URL.Query().Get("id")

	fmt.Println("AcceptFollowRequest called", "UserID:", userID, "FriendID:", friendID)

	handleFriendRequest(
		w, r,
		`UPDATE followers SET follower_status = 'accepted' WHERE followed_id = ? AND follower_id = ? AND follower_status = 'pending'`,
		"Friend request accepted successfully",
		"Failed to accept friend request",
		"You cannot accept your own request",
	)

	// Only send notification if friendID is not empty and not the same as userID
	if friendID != "" && friendID != userID {
		var p UserProfile
		err := db.DB.QueryRow("SELECT first_name, last_name, avatar FROM users WHERE id = ?", userID).Scan(&p.FirstName, &p.LastName, &p.Avatar)
		if err != nil {
			utils.Log("ERROR", "Failed to fetch user name for notification: "+err.Error())
			p.FirstName, p.LastName = "Someone", ""
		}
		realTime.BuildAndDispatchNotification(db.DB,
			userID,
			friendID,
			"follow_request_accepted",
			"accepted your Follow",
		)
	}
}
