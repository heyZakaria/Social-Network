package likes

import "net/http"

func LikesMux() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("POST /react", LikePost)
	return mux
}
