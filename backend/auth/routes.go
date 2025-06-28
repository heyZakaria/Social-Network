package auth

import (
	"net/http"
)

func AuthMux() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("POST /register", HandleRegister)
	mux.HandleFunc("POST /login", HandleLogin)
	mux.HandleFunc("GET /get-token", GetTokenHandler)
	mux.HandleFunc("POST /verify-token", VerifyTokenHandler)
	mux.HandleFunc("GET /logout", HandleLogout)

	return mux
}
