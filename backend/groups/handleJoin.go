package Group

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"

	"socialNetwork/auth"
	db "socialNetwork/db/sqlite"
	shared "socialNetwork/shared_packages"
	"socialNetwork/user"
	utils "socialNetwork/utils"
)

func handleJoin(w http.ResponseWriter, r *http.Request) {
	token := auth.GetToken(w, r)
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
	}
	utils.Log("INFO", "Recieved Group Join Request")
	Group_id, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil {
		utils.Log("ERROR", "Error Converting Group_id"+err.Error())
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Error:   "INternal Error",
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

	case "Canceling":
		_, err := db.DB.Exec("DELETE * FROM groupMember WHERE group_id = ? AND user_id = ? AND memberState = ?", Group_id, UserId, "Pending")
		if err != nil {
			utils.Log("ERROR", "Error : Deleting groupMember Pending Request "+err.Error())
			utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
				Success: false,
				Error:   "Internal Error",
			})
			return
		}
	}

	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "Group join request successed",
	})
}

// Validation Function

func ValidateJoinRequest(UserId string, GroupId int, Action string, Db *sql.DB) error {
	var groupExist bool
	var IsMember bool
	CheckGroupQuery := "SELECT EXISTS(SELECT 1 FROM groups WHERE id = ?)"
	Db.QueryRow(CheckGroupQuery, GroupId).Scan(groupExist)
	CheckGroupMemberQuery := "SELECT EXISTS(SELECT 1 FROM groupMember WHERE id = ? AND group_id = ?)"
	Db.QueryRow(CheckGroupMemberQuery, UserId, GroupId).Scan(IsMember)
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
			return fmt.Errorf("Group Request Cancelation Failed  ")
		}

	}
	return nil
}
