package Group

import "net/http"

func GroupMux() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("POST /", createGroup)
	mux.HandleFunc("GET /", fetchGroup)
	mux.HandleFunc("POST /{id}/invite/{user_id}", handleInvite)
	mux.HandleFunc("POST /{id}/join", handleJoin)

	return mux
}
