package auth

import (
	"net/http"
	post "socialNetwork/posts"
)

func AuthMux() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("POST /register", HandleRegister)
	mux.HandleFunc("POST /login", HandleLogin)

	mux.HandleFunc("POST /post", post.CreatePost)
	mux.HandleFunc("GET /post", post.GetPost)
	mux.HandleFunc("GET /posts", post.PostsPagination)

	return mux
}
