package Event

import (
	"net/http"
	db "socialNetwork/db/sqlite"
	"socialNetwork/utils"
	"strconv"
	"strings"

	"encoding/json"
)

func GetGroupEvents(w http.ResponseWriter, r *http.Request) {
	//UserId := r.Context().Value(shared.UserIDKey).(string)

	splitedPath := strings.Split(r.URL.Path, "/")
	if len(splitedPath) < 2 || splitedPath[1] == "" {
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Error:   "Bad request: Invalid Group Id",
		})
		return
	}
	GroupId := splitedPath[1]
	GroupID, err := strconv.Atoi(GroupId)
	if err != nil {
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Error:   "Bad request: Invalid Group Id",
		})
		return
	}
	var Events = []Event{}
	// TO DO get Group Name
	prepared_statement, err := db.DB.Prepare("SELECT * FROM events Where group_id = ?")
	if err != nil {
		utils.Log("ERROR", "Database query failed: "+err.Error())
	}
	defer prepared_statement.Close()

	rows, err := prepared_statement.Query(GroupID)
	if err != nil {
		utils.Log("ERROR", "Database query failed: "+err.Error())
	}

	for rows.Next() {
		var event Event
		err := rows.Scan(&event.ID, &event.Title, &event.Description, &event.DateOfEvent, &event.EventLocation, &event.GroupID, &event.CreatedAt)
		if err != nil {
			utils.Log("ERROR", "Row scan failed: "+err.Error())
			continue
		}
		Events = append(Events, event)
		// Do something with each event, e.g., append to a slice
	}

	err = json.NewEncoder(w).Encode(Events)
}
