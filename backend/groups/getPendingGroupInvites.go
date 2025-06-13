package Group

import (
	"net/http"
	db "socialNetwork/db/sqlite"
	shared "socialNetwork/shared_packages"
	"socialNetwork/utils"
)

func handlePendingInvites(w http.ResponseWriter, r *http.Request) {
	utils.Log("INFO", "Admin requested pending invites")

	UserId := r.Context().Value(shared.UserIDKey).(string)
	GroupId := r.URL.Query().Get("group_id")
	if GroupId == "" {
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "Missing Group ID",
		})
		return
	}

	// Check if user is admin of the group
	var isAdmin bool
	checkAdminQuery := `
		SELECT EXISTS (
			SELECT 1 FROM groupMember 
			WHERE user_id = ? AND group_id = ? AND memberState = 'Admin'
		)`
	err := db.DB.QueryRow(checkAdminQuery, UserId, GroupId).Scan(&isAdmin)
	if err != nil || !isAdmin {
		utils.SendJSON(w, http.StatusForbidden, utils.JSONResponse{
			Success: false,
			Message: "You must be an admin to see pending invites",
		})
		return
	}

	// Fetch pending invites
	query := `
	SELECT 
		gi.id, gi.sender_id, gi.reciever_id, gi.group_id, 
		u.first_name, u.last_name, u.avatar
	FROM 
		group_invite gi
	JOIN 
		users u ON u.id = gi.reciever_id
	WHERE 
		gi.group_id = ? AND gi.Joinstate = 'Accepted'
	`

	rows, err := db.DB.Query(query, GroupId)
	if err != nil {
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Failed to fetch pending invites",
		})
		return
	}
	defer rows.Close()

	var pending []map[string]interface{}
	for rows.Next() {
		var inv Invite
		var firstName, lastName, avatar string

		err := rows.Scan(&inv.Id, &inv.Sender_id, &inv.Reciever_id, &inv.Group_id, &firstName, &lastName, &avatar)
		if err != nil {
			utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
				Success: false,
				Message: "Error reading invite row",
			})
			return
		}

		// Combine invite + user info into a map
		entry := map[string]interface{}{
			"invite_id":   inv.Id,
			"sender_id":   inv.Sender_id,
			"reciever_id": inv.Reciever_id,
			"group_id":    inv.Group_id,
			"first_name":  firstName,
			"last_name":   lastName,
			"avatar":      avatar,
		}
		pending = append(pending, entry)
	}

	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "Pending invites fetched successfully",
		Data:    pending,
	})
}
