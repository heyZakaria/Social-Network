package Events

import (
	"net/http"
)

func EventsMux() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("POST /newEvent", CreateEvent)               // 	/groups/{id}/newEvent
	mux.HandleFunc("GET /events", GetGroupEvents)               // 	/groups/{id}/events
	mux.HandleFunc("POST /{event_id}/response", GroupEventResponse) //  	/groups/{id}/event/{event_id}/response

	return mux
}
