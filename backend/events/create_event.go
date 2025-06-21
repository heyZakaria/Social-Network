package Event

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"time"

	db "socialNetwork/db/sqlite"
	shared "socialNetwork/shared_packages"
	"socialNetwork/utils"
)

func CreateEvent(w http.ResponseWriter, r *http.Request) {
	var event Event

	err := json.NewDecoder(r.Body).Decode(&event)
	if err != nil {
		utils.Log("ERROR", "Failed to decode request body: "+err.Error())
	}
	if !ValideEventForm(event) {
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Error:   "Invalid request format",
			Message: "Event created successfully",
		})
		return
	}
	UserId := r.Context().Value(shared.UserIDKey).(string)

	splitedPath := strings.Split(r.URL.Path, "/")
	if len(splitedPath) < 2 || splitedPath[1] == "" {
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Error:   "Bad request: Invalid Group Id",
		})
		return
	}
	GroupId := splitedPath[1]
	event.GroupID, _ = strconv.Atoi(GroupId)
	if err != nil {
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Error:   "Bad request: Invalid Group Id",
		})
		return
	}
	event.Creator = UserId

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

	_, err = db.DB.Exec("INSERT INTO events ( title, description, date_of_event, event_location, event_creator, group_id) VALUES (?, ?, ?, ?, ?, ?)", event.Title, event.Description, event.DateOfEvent, event.EventLocation, event.Creator, event.GroupID)
	if err != nil {
		utils.Log("ERROR", "Failed to create event: "+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Error:   "Failed to create event",
		})
		return
	}

	utils.Log("INFO", "Event Created and Inserted in DB successfully")
	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "Event created successfully",
	})
}

func ValideEventForm(event Event) bool {
	if len(event.Title) < 10 || len(event.Title) > 100 {
		utils.Log("WARNING", "Title is required.")
		return false
	}

	if len(event.Description) < 30 || len(event.Description) > 250 {
		utils.Log("WARNING", "Description is required.")

		return false
	}

	yourDate, err := time.Parse("2006-01-02 15:04", event.DateOfEvent)
	if err != nil {
		utils.Log("WARNING", "Invalid date format.")
		return false
	}

	currentDate := time.Now()
	if yourDate.Before(currentDate) {
		utils.Log("WARNING", "Date must be in the future.")
		return false
	}

	if len(event.EventLocation) < 5 || len(event.EventLocation) > 30 {
		utils.Log("WARNING", "Location is required.")
		return false
	}

	return true
}
