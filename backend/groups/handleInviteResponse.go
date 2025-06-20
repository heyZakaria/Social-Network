package Group

import (
	"fmt"
	"net/http"

	db "socialNetwork/db/sqlite"
	"socialNetwork/utils"
)

func handleInviteResponse(w http.ResponseWriter, r *http.Request) {
	// UserId := r.Context().Value(shared.UserIDKey).(string)
	InviteId := r.URL.Query().Get("Invite_id")
	Action := r.URL.Query().Get("Action")

	var invite Invite
	err := db.DB.QueryRow(`SELECT id, sender_id, reciever_id, group_id, Joinstate FROM group_invite WHERE id = ?`, InviteId).Scan(&invite.Id, &invite.Sender_id, &invite.Reciever_id, &invite.Group_id, &invite.Joinstate)
	if err != nil {
		utils.Log("ERROR", "Error Getting Invite from Db: "+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Error:   "Internal Error",
		})
		return
	}

	var adminId string
	err = db.DB.QueryRow(`SELECT creator_id FROM groups WHERE id = ?`, invite.Group_id).Scan(&adminId)
	if err != nil {
		utils.Log("ERROR", "Error Getting Admin for Group: "+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Error:   "Internal Error",
		})
		return
	}

	switch Action {
	case "accept":
		newState := "Pending"
		// TODO : check Validation for INvite Sender Id
		if adminId == invite.Sender_id.String {
			newState = "Member"
		}

		_, err := InsertGroupMember(db.DB, newState, invite.Group_id, invite.Reciever_id)
		if err == nil {
			db.DB.Exec("UPDATE group_invite SET Joinstate = 'Accepted' WHERE id = ?", invite.Id)
		}

	case "reject":
		_, err := db.DB.Exec("DELETE FROM group_invite  WHERE id = ?", invite.Id)
		if err != nil {
			utils.Log("ERROR", "Error Rejecting Invite: "+err.Error())
			utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
				Success: false,
				Error:   "Internal Error",
			})
			return
		}
	default:
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Error:   "Invalid Action",
		})
		return
	}

	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: fmt.Sprintf("Your %s request has been handled successfully", Action),
	})
}
