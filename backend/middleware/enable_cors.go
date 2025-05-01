package middleware

import (
	"net/http"
	"slices"
)

var originAllowlist = []string{
	"http://localhost:3000",
	"https://localhost:3000",
	"http://localhost:3001",
	/* "https://localhost:3000",
	"http://cats.mew",
	"http://dog.how", */
}

var methodAllowlist = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}

func CheckCORS(next http.Handler) http.Handler {

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		method := r.Header.Get("Access-Control-Request-Method")

		if slices.Contains(originAllowlist, origin) {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Add("Vary", "Origin")

			if isPreflight(r) && slices.Contains(methodAllowlist, method) {
				w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
				w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
				w.WriteHeader(http.StatusNoContent)
				return
			}
		}

		next.ServeHTTP(w, r)
	})
}

// isPreflight reports whether r is a preflight requst.
func isPreflight(r *http.Request) bool {
	return r.Method == "OPTIONS" &&
		r.Header.Get("Origin") != "" &&
		r.Header.Get("Access-Control-Request-Method") != ""
}
