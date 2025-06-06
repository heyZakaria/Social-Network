package Group

import (
	"net/http"
)

func GroupMux() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("POST /", createGroup)
	mux.HandleFunc("GET /", fetchGroups)
	mux.HandleFunc("GET /group/", getGroup)
	mux.HandleFunc("POST /{id}/invite/{user_id}", handleInvite)
	mux.HandleFunc("POST /join", handleJoin)

	return mux
}
