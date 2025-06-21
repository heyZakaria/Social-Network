package Event

import (
	"fmt"
	"net/http"
	db "socialNetwork/db/sqlite"
	shared "socialNetwork/shared_packages"
	"socialNetwork/utils"
	"strconv"
	"strings"

	"encoding/json"
)

func GetGroupEvents(w http.ResponseWriter, r *http.Request) {
	UserId := r.Context().Value(shared.UserIDKey).(string)
	splitedPath := strings.Split(r.URL.Path, "/")
	if len(splitedPath) < 2 || splitedPath[1] == "" {
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Error:   "Bad request: Invalid Group Id",
		})
		return
	}
	fmt.Println("group_id", r.URL.Path, splitedPath)
	GroupId := splitedPath[2]
	GroupID, err := strconv.Atoi(GroupId)
	if err != nil {
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Error:   "Bad request: Invalid Group Id",
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
	var Events = []Event{}
	//"event_presence WHERE status = going"
	prepared_statement, err := db.DB.Prepare(`
	SELECT events.*, groups.title, COUNT ( CASE WHEN event_presence.status = 'going' THEN 1 END)
	FROM events 
	JOIN groups ON events.group_id = groups.id
	LEFT JOIN event_presence ON events.id = event_presence.event_id
	WHERE events.group_id = ?
	GROUP BY events.id`)
	if err != nil {
		utils.Log("ERROR", "Database query faled: "+err.Error())
	}
	defer prepared_statement.Close()

	rows, err := prepared_statement.Query(GroupID)
	if err != nil {
		utils.Log("ERROR", "Database query failed: "+err.Error())
	}

	for rows.Next() {
		var event Event
		err := rows.Scan(&event.ID, &event.Title, &event.Description, &event.DateOfEvent, &event.EventLocation, &event.Creator, &event.GroupID, &event.CreatedAt, &event.GroupName, &event.Attendees)
		if err != nil {
			utils.Log("ERROR", "Row scan failed: "+err.Error())
			continue
		}
		Events = append(Events, event)

	}
	//fmt.Println("EVENTS====", Events)
	err = json.NewEncoder(w).Encode(Events)
}
