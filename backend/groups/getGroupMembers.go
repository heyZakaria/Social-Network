package Group

import (
	"fmt"
	"net/http"

	db "socialNetwork/db/sqlite"
	Shared_groups "socialNetwork/groups_shared"

	shared "socialNetwork/shared_packages"
	"socialNetwork/utils"
)

func getGroupMembers(w http.ResponseWriter, r *http.Request) {
	var groupMembers []Shared_groups.GroupMember
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
	groupMembers, err = Shared_groups.GetMembersOfGroup(groupId, userId)
	if err != nil {
		utils.Log("ERROR", "Failed to fetch group members: "+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Failed to fetch group members",
			Error:   err.Error(),
		})
		return
	}

	utils.Log("INFO", fmt.Sprintf("Group members for group %s fetched successfully", groupId))
	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "Group members fetched successfully",
		Data:    groupMembers,
	})
}
