package auth

import (
	"net/http"
)

func AuthMux() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("POST /register", HandleRegister)
	mux.HandleFunc("POST /login", HandleLogin)
	mux.HandleFunc("GET /avatar", GetAvatar) // TODO remove because we have struct of user content all information

	return mux
}
