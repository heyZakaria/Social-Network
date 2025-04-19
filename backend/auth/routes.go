package auth

import (
	"net/http"
)

func creteMuxAuth() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/register", HandleRegister)
	return mux
}
