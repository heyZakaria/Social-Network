package Group

import (
	"net/http"
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

	return mux
}
