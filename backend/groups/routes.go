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
	mux.HandleFunc("GET /group/FriendList", getFriendList)
	mux.HandleFunc("GET /group/groupInvites", GetInvite)
	mux.HandleFunc("POST /newEvent", Event.CreateEvent)                   // 	/groups/{id}/newEvent
	mux.HandleFunc("GET /events", Event.GetGroupEvents)                   // 	/groups/{id}/events
	mux.HandleFunc("POST /{event_id}/response", Event.GroupEventResponse) //  	/groups/{id}/event/{event_id}/response

	return mux
}
