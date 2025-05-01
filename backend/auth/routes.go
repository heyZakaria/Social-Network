package auth

import (
	"net/http"
)

func AuthMux() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("/register", HandleRegister)
	mux.HandleFunc("/login", HandleLogin)

	return mux
}
