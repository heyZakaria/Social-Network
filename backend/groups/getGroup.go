package Group

import (
	"fmt"
	"net/http"

	db "socialNetwork/db/sqlite"

	shared "socialNetwork/shared_packages"
	"socialNetwork/utils"
)

func getGroup(w http.ResponseWriter, r *http.Request) {
	var g Group
	utils.Log("INFO", "Recieved Request To fetch Group page")
	GroupId := r.URL.Query().Get("id")
	UserId := r.Context().Value(shared.UserIDKey).(string)
	if UserId == "" {
		utils.Log("Error", "Error Getting User Token")
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: "Unauthorized Plz Login Or Register",
		})
		return
	}
	GroupExist, MemberExist, Err := shared.ValidateGroup(db.DB, GroupId, UserId)
	if Err != nil {
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Internal Error",
		})
		return
	}
	if !GroupExist {

		utils.Log("Error", "Bad request : Group Does Not Exist")
		utils.SendJSON(w, http.StatusNotFound, utils.JSONResponse{
			Success: false,
			Message: "Group Does Not Exist",
		})
		return
	}
	if !MemberExist {
		utils.Log("Error", "Not a Member ")
		utils.SendJSON(w, http.StatusForbidden, utils.JSONResponse{
			Success: false,
			Message: "You're Not a Member Plz Send a Join Request",
		})
		return
	}
	GetGroupQuery := `SELECT 
	g.id , 
	g.title,
	g.description, 
	g.creator_id  ,
	g.covername, 
		( SELECT COUNT(*) From groupMember gm WHERE gm.group_id = g.id AND
		gm.memberState IN ('Admin' , 'Member'))
	AS memberCount
	FROM groups g 
	WHERE g.id = ?
	`

	err := db.DB.QueryRow(GetGroupQuery, GroupId).Scan(&g.ID, &g.Title, &g.Description, &g.AdminId, &g.CoverName, &g.MemberCount)
	if err != nil {
		utils.Log("Error", "Error Getting Group from DB"+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Internal Error",
		})
		return
	}

	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "Group fetching Successed",
		Data:    g,
	})
	utils.Log("INFO", fmt.Sprintf(`Group With ID : %s Fetched With Success`, GroupId))
}
