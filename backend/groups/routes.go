package Group

import (
	"net/http"
	Event "socialNetwork/events"
)

func GroupMux() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("POST /", createGroup)
	mux.HandleFunc("GET /", fetchGroups)
	mux.HandleFunc("GET /group/", getGroup)
	mux.HandleFunc("POST /invite", handleInvite)
	mux.HandleFunc("POST /join", handleJoin)
	mux.HandleFunc("POST /invite/approve", handleAdminApproveInvite)
	mux.HandleFunc("GET /group/members", getGroupMembers)
	mux.HandleFunc("GET /group/pending", handlePendingInvites)
	mux.HandleFunc("POST /group/inviteResponse", handleInviteResponse)

	mux.HandleFunc("POST /{groupId}/newEvent", Event.CreateEvent)                   // 	/groups/{id}/newEvent
	mux.HandleFunc("GET /events/{group_id}", Event.GetGroupEvents)                   // 	/groups/{id}/events
	mux.HandleFunc("POST /event_presence/response", Event.GroupEventResponse) //  	/groups/{id}/event/{event_id}/response

	return mux
}
