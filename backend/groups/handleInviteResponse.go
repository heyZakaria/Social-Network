package Group

import (
	"fmt"
	"net/http"

	db "socialNetwork/db/sqlite"
	"socialNetwork/utils"
)

func handleInviteResponse(w http.ResponseWriter, r *http.Request) {
	// UserId := r.Context().Value(shared.UserIDKey).(string) // Use this if auth is implemented

	inviteId := r.URL.Query().Get("Invite_id")
	action := r.URL.Query().Get("Action")

	if inviteId == "" || action == "" {
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Error:   "Missing Invite_id or Action parameter",
		})
		return
	}

	fmt.Println("Invite ID:", inviteId)
	fmt.Println("Action:", action)

	var invite Invite
	err := db.DB.QueryRow(`
		SELECT id, sender_id, reciever_id, group_id, Joinstate 
		FROM group_invite WHERE id = ?`, inviteId).
		Scan(&invite.Id, &invite.Sender_id, &invite.Reciever_id, &invite.Group_id, &invite.Joinstate)
	if err != nil {
		utils.Log("ERROR", "Error getting invite from DB: "+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Error:   "Internal Error",
		})
		return
	}

	var creatorId string
	err = db.DB.QueryRow(`SELECT creator_id FROM groups WHERE id = ?`, invite.Group_id).Scan(&creatorId)
	if err != nil {
		utils.Log("ERROR", "Error getting group admin: "+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Error:   "Internal Error",
		})
		return
	}
	// fmt.Println(creatorId, invite.Reciever_id)
	switch action {
	case "accept":
		newState := "Pending"
		if invite.Sender_id.String == creatorId {
			newState = "Member" // Promote directly if the recipient is the group admin
		}

		_, err := InsertGroupMember(db.DB, newState, invite.Group_id, invite.Reciever_id)
		if err != nil {
			utils.Log("ERROR", "Error inserting group member: "+err.Error())
			utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
				Success: false,
				Error:   "Failed to join group",
			})
			return
		}

		_, err = db.DB.Exec("UPDATE group_invite SET Joinstate = 'Accepted' WHERE id = ?", invite.Id)
		if err != nil {
			utils.Log("ERROR", "Error updating invite status: "+err.Error())
			utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
				Success: false,
				Error:   "Failed to update invite",
			})
			return
		}

	case "reject":
		_, err := db.DB.Exec("DELETE FROM group_invite WHERE id = ?", invite.Id)
		if err != nil {
			utils.Log("ERROR", "Error rejecting invite: "+err.Error())
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
		Message: fmt.Sprintf("Your %s request has been handled successfully", action),
	})
}
