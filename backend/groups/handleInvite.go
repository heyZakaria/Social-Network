package Group

import (
	"fmt"
	"net/http"
	db "socialNetwork/db/sqlite"
	shared "socialNetwork/shared_packages"
	"socialNetwork/utils"
)

func handleInvite(w http.ResponseWriter, r *http.Request) {
	UserId := r.Context().Value(shared.UserIDKey).(string)
	InvitedFriend := r.URL.Query().Get("Invited_id")
	GroupId := r.URL.Query().Get("Group_id")

	err, Validated := InviteValidation(UserId, InvitedFriend, GroupId)
	if err != nil || !Validated {
		utils.Log("ERROR", "Error : Bad Request in InviteValidation"+err.Error())
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Error:   "Cannot Invite That User",
		})
		return
	}

	InsertQuery := `INSERT INTO group_invite (sender_id, reciever_id, group_id, Joinstate) VALUES (?, ?, ?, ?)`
	_, err = db.DB.Exec(InsertQuery, UserId, InvitedFriend, GroupId, "Pending")
	if err != nil {
		utils.Log("ERROR", "Error Inserting Invite to Db"+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Error:   "Internal Error",
		})
		return
	}

	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "User Has Been Invited",
	})
}

func InviteValidation(senderId, receiverId, groupId string) (error, bool) {
	var userExists, groupExists, isFriend, isMember bool

	err := db.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE id = ?)", receiverId).Scan(&userExists)
	if err != nil || !userExists {
		return fmt.Errorf("receiver does not exist"), false
	}

	err = db.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM groups WHERE id = ?)", groupId).Scan(&groupExists)
	if err != nil || !groupExists {
		return fmt.Errorf("group does not exist"), false
	}

	err = db.DB.QueryRow(`SELECT EXISTS(SELECT 1 FROM followers WHERE follower_id = ? AND followed_id = ? AND follower_status = 'accepted')`, senderId, receiverId).Scan(&isFriend)
	if err != nil {
		return err, false
	}

	err = db.DB.QueryRow(`SELECT EXISTS(SELECT 1 FROM groupMember WHERE group_id = ? AND user_id = ?)`, groupId, receiverId).Scan(&isMember)
	if err != nil {
		return err, false
	}

	if isMember {
		return fmt.Errorf("user already in group"), false
	}

	if !isFriend {
		return fmt.Errorf("can only invite friends"), false
	}

	return nil, true
}

// func InviteValidation(UserId string, InvitedId string, GroupId string) (error, bool) {

// 	CheckInviteId := "SELECT EXISTS(SELECT 1 FROM users WHERE id = ?)"
// 	CheckGroupQuery := "SELECT EXISTS(SELECT 1 FROM groups WHERE id = ?)"
// 	CheckIfFriendQuery := `SELECT EXISTS(SELECT 1 FROM follow_relationships WHERE follower_id = ? AND followed_id = ?
// 		AND status = 'accepted')`
// 	CheckIfMember := "SELECT EXISTS(SELECT 1 FROM groupMember Where group_id = ? AND user_Id = ?)"
// }
