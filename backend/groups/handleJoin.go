package Group

import (
	"database/sql"
	"fmt"
	"net/http"

	db "socialNetwork/db/sqlite"
	"socialNetwork/notifications"
	shared "socialNetwork/shared_packages"
	utils "socialNetwork/utils"
)

func handleJoin(w http.ResponseWriter, r *http.Request) {
	/* token := auth.GetToken(w, r)
	if token == "" {
		return
	}
	_, err := user.GetUserIDByToken(token)
	if err != nil {
		utils.Log("Error Getting User Token", err.Error())
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: err.Error(),
		})
		return
	} */

	utils.Log("INFO", "Recieved Group Join Request")
	Group_id := r.URL.Query().Get("id")
	// if err != nil {
	// 	utils.Log("ERROR", "Error Converting Group_id"+err.Error())
	// 	utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
	// 		Success: false,
	// 		Error:   "INternal Error",
	// 	})
	// 	return
	// }
	var adminId string
	err := db.DB.QueryRow("SELECT creator_id FROM groups WHERE id = ?", Group_id).Scan(&adminId)
	if err != nil {
		utils.Log("ERROR", "Error get admin ID from Db"+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Error:   "Internal Error",
		})
		return
	}

	Action := r.URL.Query().Get("action")
	UserId := r.Context().Value(shared.UserIDKey).(string)
	err = ValidateJoinRequest(UserId, Group_id, Action, db.DB)
	if err != nil {
		utils.Log("ERROR", "Error : Bad Request in ValidateJoinRequest"+err.Error())
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Error:   "Wrong Action on Join Request",
		})
		return
	}
	var inviteId int64
	switch Action {
	case "Joining":
		_, err := InsertGroupMember(db.DB, "Pending", Group_id, UserId)
		if err != nil {
			utils.Log("ERROR", "Error Inserting Member to Db"+err.Error())
			utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
				Success: false,
				Error:   "Internal Error",
			})
			return
		}
		InviteQuery := `INSERT INTO group_invite (reciever_id , Joinstate , Group_id) VALUES (? , ? , ?)`
		res, err := db.DB.Exec(InviteQuery, UserId, "Accepted", Group_id)
		if err != nil {
			utils.Log("ERROR", "Error Inserting Invite to Db"+err.Error())
			utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
				Success: false,
				Error:   "Internal Error",
			})
			return
		}

		inviteId, err = res.LastInsertId()
		if err != nil {
			utils.Log("ERROR", "Error to get invitedId from DB"+err.Error())
			utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
				Success: false,
				Error:   "Internal Error",
			})
		}
		notifications.BuildAndDispatchNotification(
			db.DB,
			inviteId,
			UserId,
			adminId,
			"invite_group_admin",
			"Want to join your group",
			"",
			0,
		)

	case "Canceling":
		_, err := db.DB.Exec("DELETE FROM groupMember WHERE group_id = ? AND user_id = ? AND memberState = ?", Group_id, UserId, "Pending")
		utils.Log("LOG", "delet user from group member")
		if err != nil {
			utils.Log("ERROR", "Error : Deleting groupMember Pending Request "+err.Error())
			utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
				Success: false,
				Error:   "Internal Error",
			})
			return
		}
		var inviteID int64
		err = db.DB.QueryRow("SELECT id FROM group_invite WHERE reciever_id = ? AND Group_id = ? AND sender_id IS NULL", UserId, Group_id).Scan(&inviteID)
		if err != nil {
			utils.Log("ERROR", "Error : get group invite id "+err.Error())
			utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
				Success: false,
				Error:   "Internal Error",
			})
			return
		}

		notifications.DeleteFollowRequestNotification(
			adminId,
			UserId,
			"invite_group_admin",
			inviteID,
		)

		_, err = db.DB.Exec("DELETE FROM group_invite WHERE id = ?", inviteId)
		utils.Log("LOG", "delet user from  group_invite")

		if err != nil {
			utils.Log("ERROR", "Failed to delete invite: "+err.Error())
			utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
				Success: false,
				Error:   "Failed to reject invite",
			})
			return
		}

		fmt.Println("UserId", UserId)
		fmt.Println("adminId", adminId)
		fmt.Println("inviteId", inviteID)

		utils.Log("LOG", "dlete from notification")

	}
	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "Group join request successed",
	})
}

// Validation Function

func ValidateJoinRequest(UserId string, GroupId string, Action string, Db *sql.DB) error {
	groupExist, IsMember, Err := shared.ValidateGroup(db.DB, GroupId, UserId)
	if Err != nil {
		return Err
	}

	if !groupExist {
		return fmt.Errorf("Group Does Not Exist")
	}
	switch Action {
	case "Joining":
		if IsMember {
			return fmt.Errorf("You Have Already Sent A Join Request To This Group")
		}

	case "Canceling":
		if !IsMember {
			return fmt.Errorf("Group Request Cancelation Failed ")
		}
	}
	return nil
}
