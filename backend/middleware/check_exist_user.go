package middleware

import (
	"net/http"

	"socialNetwork/auth"
	shared "socialNetwork/context"
	"socialNetwork/utils"
)

// Handler /verify
func CheckUserExeting(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var UserID string
		if r.URL.String() != "/api/login" && r.URL.String() != "/api/register" {
			token := auth.GetToken(w, r)
			if token == "" {
				utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
					Success: false,
					Message: "Please login to continue",
					Error:   "You are not Authorized.",
				})
				return
			}
			payload, err := auth.VerifyJWT(token)
			UserID = payload.UserID
			if err != nil || UserID == "" {
				utils.Log("ERROR", "Invalid Token in CheckUserExeting Handler: ")
				utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
					Success: false,
					Message: "Please login to continue",
					Error:   "You are not Authorized.",
				})
				return
			}
		}
		next.ServeHTTP(w, r.WithContext(shared.SetContext(r, UserID)))
	})
}
