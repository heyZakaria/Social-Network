package comment

import "net/http"

func CommentMux() http.Handler {
	mux := http.NewServeMux()
	// local:8080/comment/comment/comment

	mux.HandleFunc("POST /sendcomment", CreatePost)
	mux.HandleFunc("GET /getcomment", GetPost)
	return mux
}
