package Event

import (
	"encoding/json"
	"fmt"
	"net/http"
	db "socialNetwork/db/sqlite"
	shared "socialNetwork/shared_packages"
	"socialNetwork/utils"
	"strings"
)

func GroupEventResponse(w http.ResponseWriter, r *http.Request) {
	UserId := r.Context().Value(shared.UserIDKey).(string)
	var EventResp EventResponse

	err := json.NewDecoder(r.Body).Decode(&EventResp)
	if err != nil {
		utils.Log("ERROR", "Failed to decode request body: "+err.Error())
	}
	fmt.Println("EEEEEE", EventResp)
	splitedPath := strings.Split(r.URL.Path, "/")
	if len(splitedPath) < 2 || splitedPath[1] == "" {
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Error:   "Bad request: Invalid Group Id",
		})
		return
	}

	/* _, err = strconv.Atoi(EventResp.Group_id)
	if err != nil {
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Error:   "Bad request: Invalid Group Id",
		})
		return
	} */

	GroupExist, MemberExist, Err := shared.ValidateGroup(db.DB, EventResp.Group_id, UserId)
	if Err != nil {
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Internal Error",
		})
		return
	}
	if !GroupExist {

		utils.Log("ERROR", "Bad request : Group Does Not Exist")
		utils.SendJSON(w, http.StatusNotFound, utils.JSONResponse{
			Success: false,
			Message: "Group Does Not Exist",
		})
		return
	}
	if !MemberExist {
		utils.Log("ERROR", "Not a Member ")
		utils.SendJSON(w, http.StatusForbidden, utils.JSONResponse{
			Success: false,
			Message: "You're Not a Member Plz Send a Join Request",
		})
		return
	}
	R, err := db.DB.Exec(`
    UPDATE event_presence 
    SET status = ? 
    WHERE group_id = ? AND event_id = ? AND user_id = ?`, EventResp.Presence, EventResp.Group_id, EventResp.Event_id, UserId)

	if err != nil {
		utils.Log("ERROR", "Failed to instert event presence: "+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Error:   "Failed to instert event presence",
		})
		return
	}
	rowsAffected, err := R.RowsAffected()
	if err != nil {
		utils.Log("ERROR", err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Error:   "Internal Server Error",
		})
		return
	}

	if rowsAffected == 0 {
		_, err := db.DB.Exec(`
        INSERT INTO event_presence (status, group_id, event_id, user_id)
        VALUES (?, ?, ?, ?)
    `, EventResp.Presence, EventResp.Group_id, EventResp.Event_id, UserId)
		if err != nil {

			utils.Log("ERROR", "Event presence doesn't inserted in DB")
			utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
				Success: false,
				Error:   "Internal Server Error",
			})
			return
		}
	}

	utils.Log("INFO", "Event Presence Inserted in DB successfully")
	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "Event presence inserted successfully",
		Data:    EventResp,
	})
}
