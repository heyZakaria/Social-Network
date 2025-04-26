package auth

import (
	"net/http"
)

func AuthMux() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/register", HandleRegister)
	// mux.HandleFunc("/api/login", HandleLogin)

	return mux
}
