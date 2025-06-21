package Group

import (
	"net/http"

	db "socialNetwork/db/sqlite"
	shared "socialNetwork/shared_packages"
	"socialNetwork/utils"
)

func GetInvite(w http.ResponseWriter, r *http.Request) {
	var Invites []map[string]any
	UserId := r.Context().Value(shared.UserIDKey).(string)
	if UserId == "" {
		utils.Log("Error", "Error Getting User Token")
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: "Unauthorized Plz Login Or Register",
		})
		return
	}
	Query := `	SELECT
					gi.id,gi.sender_id,gi.reciever_id , gi.Group_id,
					g.title, u.avatar , u.first_name , u.last_name
				FROM 
					group_invite gi
				JOIN 
					groups g 
				ON 
					gi.Group_id = g.id
				JOIN
					users u
				ON
					gi.sender_id = u.id
				WHERE
					reciever_id = ? 
				AND
					sender_id IS NOT NULL
				AND
				Joinstate = 'Pending'
					`
	rows, err := db.DB.Query(Query, UserId)
	if err != nil {
		utils.Log("ERROR", "Failed to get Invites: "+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Error:   "Failed to reject invite",
		})
		return
	}
	defer rows.Close()
	for rows.Next() {
		var inv Invite
		var groupTitle, SenderFirstname, SenderLastname, SenderAvatar string

		err := rows.Scan(&inv.Id, &inv.Sender_id, &inv.Reciever_id, &inv.Group_id, &groupTitle, &SenderAvatar, &SenderFirstname, &SenderLastname)
		if err != nil {
			utils.Log("Error Scan Group Invite ", err.Error())
			utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
				Success: false,
				Message: err.Error(),
			})
			return
		}
		entry := map[string]any{
			"invite_id":   inv.Id,
			"sender_id":   inv.Sender_id,
			"reciever_id": inv.Reciever_id,
			"group_id":    inv.Group_id,
			"first_name":  SenderFirstname,
			"last_name":   SenderLastname,
			"avatar":      SenderAvatar,
			"group_title": groupTitle,
		}
		Invites = append(Invites, entry)
	}
	utils.Log("INFO ", "Invite Request Group to join fetched successfully")

	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "Invite Request Group to join fetched successfully",
		Data:    Invites,
	})
}
