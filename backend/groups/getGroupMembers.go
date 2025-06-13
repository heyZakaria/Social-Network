package Group

import (
	"fmt"
	"net/http"

	db "socialNetwork/db/sqlite"

	shared "socialNetwork/shared_packages"
	"socialNetwork/utils"
)

func getGroupMembers(w http.ResponseWriter, r *http.Request) {
	var groupMembers []GroupMember
	utils.Log("INFO", "Received request to fetch group members")

	groupId := r.URL.Query().Get("id")
	userId := r.Context().Value(shared.UserIDKey).(string)

	if groupId == "" || userId == "" {
		utils.Log("ERROR", "Missing group ID or user ID")
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "Invalid request. Group ID or user token is missing.",
		})
		return
	}

	groupExist, memberExist, err := ValidateGroup(db.DB, groupId, userId)
	if err != nil {
		utils.Log("ERROR", "Group validation error: "+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Internal server error",
		})
		return
	}
	if !groupExist {
		utils.Log("ERROR", "Group not found")
		utils.SendJSON(w, http.StatusNotFound, utils.JSONResponse{
			Success: false,
			Message: "Group does not exist",
		})
		return
	}
	if !memberExist {
		utils.Log("ERROR", "User is not a member of the group")
		utils.SendJSON(w, http.StatusForbidden, utils.JSONResponse{
			Success: false,
			Message: "You are not a member of this group",
		})
		return
	}

	query := `
		SELECT u.first_name, u.last_name, u.id, u.avatar 
		FROM groupMember gm
		JOIN users u ON u.id = gm.user_id
		WHERE gm.group_id = ? AND gm.memberState IN ('Member', 'Admin') AND u.id != ?
		ORDER BY u.first_name
	`

	rows, err := db.DB.Query(query, groupId, userId)
	if err != nil {
		utils.Log("ERROR", "Failed to query group members: "+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Internal error while fetching members",
		})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var gm GroupMember
		if err := rows.Scan(&gm.FirstName, &gm.LastName, &gm.User_id, &gm.Avatar); err != nil {
			utils.Log("ERROR", "Failed to scan group member: "+err.Error())
			utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
				Success: false,
				Message: "Error processing group data",
			})
			return
		}
		groupMembers = append(groupMembers, gm)
	}

	utils.Log("INFO", fmt.Sprintf("Group members for group %s fetched successfully", groupId))
	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "Group members fetched successfully",
		Data:    groupMembers,
	})
}
