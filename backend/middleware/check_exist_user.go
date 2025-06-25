package middleware

import (
	"net/http"

	shared "socialNetwork/shared_packages"
	Tkn "socialNetwork/token"
	"socialNetwork/utils"
)

// Handler /verify
func CheckUserExeting(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var UserID string
		var err error
		whitelist := map[string]bool{
			"/api/login":        true,
			"/api/register":     true,
			"/api/verify-token": true,
		}
		if !whitelist[r.URL.Path] {
			token := Tkn.GetToken(w, r)
			if token == "" {
				utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
					Success: false,
					Message: "Please login to continue",
					Error:   "You are not Authorized.",
				})
				return
			}

			UserID, err = Tkn.GetUserIDByToken(token)
			r.Header.Set("UserID", UserID)
			if err != nil || UserID == "" {
				utils.Log("ERROR", "Invalid Token in CheckUserExeting Handler: "+token+" UserID:"+UserID)
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
