package post

import "net/http"

func PostMux() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("POST /createpost", CreatePost)
	mux.HandleFunc("GET /getsinglepost", GetPost)
	mux.HandleFunc("GET /getposts", PostsPagination)
	return mux
}
