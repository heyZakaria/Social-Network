package Group

import (
	"database/sql"
	"fmt"
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
	fmt.Println(GroupId, UserId)
	err := db.DB.QueryRow(checkAdminQuery, UserId, GroupId).Scan(&isAdmin)
	if err != nil || !isAdmin {
		utils.SendJSON(w, http.StatusForbidden, utils.JSONResponse{
			Success: false,
			Message: "You must be an admin to see pending invites",
		})
		return
	}

	// Fetch pending invites
	// query1 := `
	// SELECT
	// 	gi.id, gi.sender_id, gi.reciever_id, gi.group_id,
	// 	u.first_name, u.last_name, u.avatar
	// FROM
	// 	group_invite gi
	// JOIN
	// 	users u ON u.id = gi.reciever_id
	// WHERE
	// 	gi.group_id = ? AND gi.Joinstate = 'Accepted'
	// `

	query := `
SELECT
	(SELECT id FROM group_invite WHERE reciever_id = gm.user_id AND Group_id = ? AND Joinstate = 'Accepted') AS invite_id,
	gm.user_id,
	gm.group_id,
	u.first_name, 
	u.last_name, 
	u.avatar
FROM
	groupMember gm
JOIN
	users u ON u.id = gm.user_id
WHERE 
	gm.memberState = 'Pending' AND gm.group_id = ?
`

	rows, err := db.DB.Query(query, GroupId, GroupId)
	if err != nil {
		if err == sql.ErrNoRows {
			fmt.Println("hgeeeeeeeeeeeeeeere")
		}
		utils.Log("ERROR", "Eroor Getting rows in Pending Invite")

		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Failed to fetch pending invites",
		})
		return
	}
	defer rows.Close()

	var pending []map[string]interface{}
	for rows.Next() {
		var gm GroupMember
		var InviteId int
		// var firstName, lastName, avatar string

		err := rows.Scan(&InviteId, &gm.User_id, &gm.Group_id, &gm.FirstName, &gm.LastName, &gm.Avatar)
		if err != nil {
			utils.Log("ERROR", "Error Scanning rows in Pending Invite")
			utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
				Success: false,
				Message: "Error reading invite row",
			})
			return
		}

		entry := map[string]interface{}{
			"invite_id": InviteId,
			"sender_id": gm.User_id,
			// "reciever_id": inv.Reciever_id,
			"group_id":   gm.Group_id,
			"first_name": gm.FirstName,
			"last_name":  gm.LastName,
			"avatar":     gm.Avatar,
		}
		pending = append(pending, entry)
	}

	fmt.Println("peeeeeending", pending)
	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "Pending invites fetched successfully",
		Data:    pending,
	})
}
