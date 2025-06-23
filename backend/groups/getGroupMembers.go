package Group

import (
	"fmt"
	"net/http"

	db "socialNetwork/db/sqlite"

	shared "socialNetwork/shared_packages"
	"socialNetwork/utils"
)

func getGroupMembers(w http.ResponseWriter, r *http.Request) {
	utils.Log("INFO", "Received request to fetch group members")

	groupId := r.URL.Query().Get("id")
	userId := r.Context().Value(shared.UserIDKey).(string)
	fmt.Println("groupId : ", groupId, "User:", userId)
	if groupId == "" || userId == "" {
		utils.Log("ERROR", "Missing group ID or user ID")
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "Invalid request. Group ID or user token is missing.",
		})
		return
	}

	groupExist, memberExist, err := shared.ValidateGroup(db.DB, groupId, userId)
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
	groupMembers, err := GetMembersOfGroup(groupId, userId)
	if err != nil {
		utils.Log("ERROR", "Failed to fetch group members: "+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Failed to fetch group members",
			Error:   err.Error(),
		})
		return
	}
	fmt.Println(groupMembers)

	utils.Log("INFO", fmt.Sprintf("Group members for group %s fetched successfully", groupId))
	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "Group members fetched successfully",
		Data:    groupMembers,
	})
}

func GetMembersOfGroup(groupId string, userId string) (groupMembers []GroupMember, err error) {
	query := `
		SELECT u.first_name, u.last_name, u.id, u.avatar , gm.memberState
		FROM groupMember gm
		JOIN users u ON u.id = gm.user_id
		WHERE gm.group_id = ? AND gm.memberState IN ('Member', 'Admin') 
		ORDER BY u.first_name
	`

	rows, err := db.DB.Query(query, groupId, userId)
	if err != nil {
		err = fmt.Errorf("failed to query group members: %w", err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var gm GroupMember
		if err := rows.Scan(&gm.FirstName, &gm.LastName, &gm.User_id, &gm.Avatar, &gm.Role); err != nil {
			err = fmt.Errorf("failed to scan group member: %w", err)
			return nil, err
		}
		groupMembers = append(groupMembers, gm)
	}
	return groupMembers, nil
}
