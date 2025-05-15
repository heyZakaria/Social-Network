package post

import "net/http"

func PostMux() http.Handler {
	mux := http.NewServeMux()
	// local:8080/api/post/post

	mux.HandleFunc("POST /createpost", CreatePost)
	mux.HandleFunc("GET /getsinglepost", GetPost)
	mux.HandleFunc("GET /getposts", PostsPagination)
	return mux
}
