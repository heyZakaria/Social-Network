package comments

import "net/http"

// here routes for save and get comment from data base
func CommentMux() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("POST /sendcomment", CommentSaver)
	mux.HandleFunc("GET /getcomment", GetCommentByPost)

	return mux
}
