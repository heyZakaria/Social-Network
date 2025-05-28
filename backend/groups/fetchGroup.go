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
		return
	}
	Groups, err := GetGroups(db.DB, User_id)
	if err != nil {
		utils.Log("Error Fetching Groups", err.Error())
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: err.Error(),
		})
		return
	}
	utils.Log("INFO", "Groups Fetched Successfuly")
	fmt.Println(Groups)
	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Data:    Groups,
	})
}

func GetGroups(db *sql.DB, currentUserID string) ([]Group, error) {
	query := `
	SELECT 
		g.id,
		g.title,
		g.descriptio,
		g.covername,
		COUNT(gmAll.id) AS memberCount,
	COALESCE(gmCurrent.memberState, 'Not Member')	
	FROM groups g
	LEFT JOIN groupMember gmAll ON g.id = gmAll.group_id
	LEFT JOIN groupMember gmCurrent 
		ON g.id = gmCurrent.group_id AND gmCurrent.id = ?
	GROUP BY g.id, g.title, g.descriptio, g.covername, gmCurrent.memberState
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
		if err := rows.Scan(&g.ID, &g.Title, &g.Description, &g.CoverName, &g.MemberCount, &g.MemberState); err != nil {
			utils.Log("ERROR", "Scan failed: "+err.Error())
			return nil, err
		}
		results = append(results, g)
	}
	return results, nil
}
