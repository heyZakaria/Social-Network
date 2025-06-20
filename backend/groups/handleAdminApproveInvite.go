package Group

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"

	db "socialNetwork/db/sqlite"
	shared "socialNetwork/shared_packages"
	"socialNetwork/utils"
)

func handleAdminApproveInvite(w http.ResponseWriter, r *http.Request) {
	utils.Log("INFO", "Recieved a Admin approving request")
	var Invite Invite
	UserId := r.Context().Value(shared.UserIDKey).(string)
	Invite_id := r.URL.Query().Get("Invite")
	Action := r.URL.Query().Get("Action")

	if Invite_id == "" || Action == "" {
		utils.Log("ERROR", "Missing data in URL query")
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Error:   "Missing information. Please try again.",
		})
		return
	}

	// Parse Invite ID
	InviteIdInt, err := strconv.Atoi(Invite_id)
	if err != nil {
		utils.Log("ERROR", "Invalid Invite ID format")
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Error:   "Invalid Invite ID",
		})
		return
	}

	// Fetch Invite Info
	GetInvite := `SELECT sender_id, reciever_id, group_id FROM group_invite WHERE id = ?`
	err = db.DB.QueryRow(GetInvite, InviteIdInt).Scan(&Invite.Sender_id, &Invite.Reciever_id, &Invite.Group_id)
	if err != nil {
		if err == sql.ErrNoRows {
			utils.Log("ERROR", "Invite does not exist")
			utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
				Success: false,
				Error:   "Invite does not exist",
			})
			return
		}
		utils.Log("ERROR", "Database error while retrieving invite: "+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Error:   "Internal server error. Please try later.",
		})
		return
	}

	// Validate approval
	_, err = ApprovingValidation(UserId, InviteIdInt, Invite.Group_id, Invite.Reciever_id)
	if err != nil {
		utils.Log("ERROR", "Invite validation failed: "+err.Error())
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	switch Action {
	case "accept":
		_, err := InsertGroupMember(db.DB, "Member", Invite.Group_id, Invite.Reciever_id)
		if err != nil {
			utils.Log("ERROR", "Failed to promote to group member: "+err.Error())
			utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
				Success: false,
				Error:   "Failed to approve member",
			})
			return
		}

		_, err = db.DB.Exec("DELETE FROM group_invite WHERE id = ?", InviteIdInt)
		if err != nil {
			utils.Log("ERROR", "Failed to delete invite after approval: "+err.Error())
			utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
				Success: false,
				Error:   "Cleanup failed. Please try again.",
			})
			return
		}

	case "reject":
		_, err = db.DB.Exec("DELETE FROM group_invite WHERE id = ?", InviteIdInt)
		if err != nil {
			utils.Log("ERROR", "Failed to delete invite: "+err.Error())
			utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
				Success: false,
				Error:   "Failed to reject invite",
			})
			return
		}

		_, err = db.DB.Exec("DELETE FROM groupMember WHERE user_id = ? AND group_id = ? AND memberState = 'Pending'", Invite.Reciever_id, Invite.Group_id)
		if err != nil {
			utils.Log("ERROR", "Failed to remove pending member: "+err.Error())
			utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
				Success: false,
				Error:   "Failed to clean pending status",
			})
			return
		}
	default:
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Error:   "Invalid action. Must be 'accept' or 'reject'",
		})
		return
	}

	utils.Log("INFO", fmt.Sprintf("Admin %s invite %d successfully", Action, InviteIdInt))
	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: fmt.Sprintf("Your action '%s' on the invite has been completed successfully.", Action),
	})
}

func ApprovingValidation(CurrentUserId string, InviteId int, GroupId string, SenderId string) (bool, error) {
	var IsAdmin, IsAccepted, IsMember bool

	CheckingIfAdmin := `
		SELECT EXISTS (
			SELECT 1 FROM groupMember 
			WHERE user_id = ? AND group_id = ? AND memberState = 'Admin'
		)`
	err := db.DB.QueryRow(CheckingIfAdmin, CurrentUserId, GroupId).Scan(&IsAdmin)
	if err != nil {
		return false, fmt.Errorf("Error checking admin: %s", err)
	}

	CheckIfSenderAccepted := `
		SELECT EXISTS (
			SELECT 1 FROM group_invite 
			WHERE id = ? AND Joinstate = 'Accepted'
		)`
	err = db.DB.QueryRow(CheckIfSenderAccepted, InviteId).Scan(&IsAccepted)
	if err != nil {
		return false, fmt.Errorf("Error checking if invite is accepted: %s", err)
	}

	CheckIfMember := `
		SELECT EXISTS (
			SELECT 1 FROM groupMember 
			WHERE group_id = ? AND user_id = ? AND memberState = 'Member'
		)`
	err = db.DB.QueryRow(CheckIfMember, GroupId, SenderId).Scan(&IsMember)
	if err != nil {
		return false, fmt.Errorf("Error checking membership: %s", err)
	}

	if !IsAdmin {
		return false, fmt.Errorf("Only admins can approve invites")
	}
	if !IsAccepted {
		return false, fmt.Errorf("The invite must be accepted by the user first")
	}
	if IsMember {
		return false, fmt.Errorf("User is already a member of the group")
	}

	return true, nil
}
