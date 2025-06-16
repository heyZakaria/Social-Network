package Event

import (
	"net/http"
	db "socialNetwork/db/sqlite"
	"socialNetwork/utils"

	"encoding/json"
)

func GetGroupEvents(w http.ResponseWriter, r *http.Request) {
	/* if !middleware.IsLoggedIn(w, r) {
		return
	}
	utils.Log("INFO", "Received request for GetGroupEvents") */
	var Events = []Event{}
	// TO DO get Group Name
	prepared_statement, err := db.DB.Prepare("SELECT * FROM events Where group_id = ?")
	if err != nil {
		utils.Log("ERROR", "Database query failed: "+err.Error())
	}
	defer prepared_statement.Close()

	rows, err := prepared_statement.Query(1)
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
