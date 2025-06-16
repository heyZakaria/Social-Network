package Event

import (
	"encoding/json"
	"net/http"
	"socialNetwork/utils"
)

type EventResponse struct {
	Event_id int  `json:"event_id"`
	Presence bool `json:"presence"`
}

func GroupEventResponse(w http.ResponseWriter, r *http.Request) {
	var E EventResponse

	err := json.NewDecoder(r.Body).Decode(&E)
	if err != nil {
		utils.Log("ERROR", "Failed to decode request body: "+err.Error())
	}
}
