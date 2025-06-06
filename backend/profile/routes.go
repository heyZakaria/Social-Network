package profile

import "net/http"

func ProfileMux() http.Handler {
	mux := http.NewServeMux()
	
	mux.HandleFunc("GET /friends", GetFriendsAndRequests)
	mux.HandleFunc("GET /profile", GetUserProfile)
	mux.HandleFunc("PUT /privacy", ProfileStatus)
	mux.HandleFunc("GET /get/profile", GetOtherUserProfile)
	mux.HandleFunc("GET /follow", ToggleFollowUser)
	mux.HandleFunc("POST /follow", ToggleFollowUser)
	mux.HandleFunc("POST /accept", AcceptFollowRequest)
	mux.HandleFunc("POST /reject", RejectFollowRequest)

	return mux
}
