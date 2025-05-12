package auth

import (
	"net/http"
)

func AuthMux() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("POST /register", HandleRegister)
	mux.HandleFunc("POST /login", HandleLogin)
	
	return mux
}
