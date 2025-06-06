package Group

import (
	"database/sql"
	"fmt"
	"net/http"

	"socialNetwork/auth"
	db "socialNetwork/db/sqlite"
	"socialNetwork/user"
	"socialNetwork/utils"
)

func fetchGroups(w http.ResponseWriter, r *http.Request) {
	utils.Log("INFO", "Recieved Request for fetching groups")
	token := auth.GetToken(w, r)
	if token == "" {
		return
	}
	User_id, err := user.GetUserIDByToken(token)
	if err != nil {
		utils.Log("Error Getting User Token", err.Error())
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: err.Error(),
		})
		fmt.Println("1")
		return
	}
	Groups, err := GetGroups(db.DB, User_id)
	if err != nil {
		utils.Log("Error Fetching Groups", err.Error())
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: err.Error(),
		})
		fmt.Println("2")

		return
	}
	utils.Log("INFO", "Groups Fetched Successfuly")
	for _, grop := range Groups {
		fmt.Print("____________________________")
		fmt.Println("group title :", grop.Title)
		fmt.Println("group desc :", grop.Description)
		fmt.Println("group admin id  :", grop.AdminId)
		fmt.Println("group cover :", grop.CoverName)
		fmt.Println("member state :", grop.MemberState)
		fmt.Println("____________________________")

	}
	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Data:    Groups,
	})
}

func GetGroups(db *sql.DB, currentUserID string) ([]Group, error) {
	query := `
	SELECT  
    	g.title, 
    	g.descriptio, 
    	g.covername, 
    	g.id, 
    (SELECT COUNT(*) FROM groupMember WHERE group_id = g.id AND (memberState = "Member" OR memberState = "Admin" )) AS member_count,  
    	COALESCE(gmCurrent.memberState, 'Join') AS mb 
	FROM groups g 
	LEFT JOIN groupMember gmCurrent 
    ON gmCurrent.group_id = g.id AND gmCurrent.user_id = ?

	`

	rows, err := db.Query(query, currentUserID)
	if err != nil {
		utils.Log("ERROR", "Query failed: "+err.Error())
		return nil, err
	}
	defer rows.Close()

	var results []Group
	for rows.Next() {
		var g Group
		if err := rows.Scan(&g.Title, &g.Description, &g.CoverName, &g.ID, &g.MemberCount, &g.MemberState); err != nil {
			utils.Log("ERROR", "Scan failed: "+err.Error())
			return nil, err
		}
		results = append(results, g)
	}
	return results, nil
}
