package Events

import (
	"net/http"
)

func EventsMux() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("POST /newEvent", CreateEvent)
	// mux.HandleFunc("POST /login", HandleLogin)

	return mux
}
