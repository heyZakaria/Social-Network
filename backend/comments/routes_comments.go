package comments

import "net/http"

func CommentMux() http.Handler {
	mux := http.NewServeMux()
	// local:8080/comment/comment/comment
	var c Comment
	mux.HandleFunc("POST /sendcomment", c.CommentSaver)
	mux.HandleFunc("GET /getcomment", c.GetCommentByPost)

	return mux
}
