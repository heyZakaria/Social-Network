package post

import "net/http"

func PostMux() http.Handler {
	mux := http.NewServeMux()
	// local:8080/api/post/post

	mux.HandleFunc("POST /post", CreatePost)
	mux.HandleFunc("GET /post", GetPost)
	mux.HandleFunc("GET /posts", PostsPagination)
	return mux
}
