package middleware

import (
	"net/http"
	"slices"
)

var originAllowlist = []string{
	"http://localhost:3000",
	"http://localhost:9000",
	"https://localhost:9443",
}

var methodAllowlist = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}

func CheckCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		method := r.Header.Get("Access-Control-Request-Method")
		
		// Allow same-origin requests to pass through
		if origin == "" {
			next.ServeHTTP(w, r)
			return
		}
		
		if slices.Contains(originAllowlist, origin) || origin == r.Host {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Add("Vary", "Origin")
			
			if isPreflight(r) && (slices.Contains(methodAllowlist, method) || method == "") {
				w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
				w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
				w.Header().Set("Access-Control-Max-Age", "86400")
				w.WriteHeader(http.StatusNoContent)
				return
			}
		}
		next.ServeHTTP(w, r)
	})
}
func isPreflight(r *http.Request) bool {
	return r.Method == "OPTIONS" &&
		r.Header.Get("Origin") != "" &&
		r.Header.Get("Access-Control-Request-Method") != ""
}
