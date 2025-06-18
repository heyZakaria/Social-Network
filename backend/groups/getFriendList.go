package Group

import (
	"fmt"
	"net/http"

	db "socialNetwork/db/sqlite"
	profile "socialNetwork/profile"
	shared "socialNetwork/shared_packages"
	"socialNetwork/utils"
)

func getFriendList(w http.ResponseWriter, r *http.Request) {
	var Users []profile.User
	utils.Log("INFO", "Received request to fetch FriendList")

	userId := r.Context().Value(shared.UserIDKey).(string)
	groupId := r.URL.Query().Get("id")

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

	query := `
		SELECT DISTINCT user_id, u.avatar, u.last_name, u.first_name
		FROM (
			SELECT F.follower_id AS user_id FROM followers F WHERE F.followed_id = ?
			UNION
			SELECT F.followed_id AS user_id FROM followers F WHERE F.follower_id = ?
		) AS NotMemberFriends
		JOIN users u ON u.id = NotMemberFriends.user_id
		WHERE NOT EXISTS (
			SELECT 1 FROM groupMember GM
			WHERE GM.user_id = NotMemberFriends.user_id AND GM.group_id = ?
		)
		AND NotMemberFriends.user_id != ?
	`

	rows, err := db.DB.Query(query, userId, userId, groupId, userId)
	if err != nil {
		utils.Log("ERROR", "Failed to query FriendList: "+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Internal error while fetching FriendList",
		})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var u profile.User
		if err := rows.Scan(&u.ID, &u.Avatar, &u.LastName, &u.FirstName); err != nil {
			utils.Log("ERROR", "Error processing FriendList data: "+err.Error())
			utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
				Success: false,
				Message: "Error processing FriendList data",
			})
			return
		}
		Users = append(Users, u)
	}
	fmt.Println("useres", Users)
	utils.Log("INFO", fmt.Sprintf("Friends in group %s fetched successfully", groupId))
	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "Friends fetched successfully",
		Data:    Users,
	})
}
