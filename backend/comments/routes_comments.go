package comments

import "net/http"

func CommentMux() http.Handler {
	mux := http.NewServeMux()
	// local:8080/comment/comment/comment

	mux.HandleFunc("POST /sendcomment", CommentSaver)
	// mux.HandleFunc("GET /getcomment", GetCommentByPost)
	return mux
}
