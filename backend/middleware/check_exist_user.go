package middleware

import (
	"net/http"

	"socialNetwork/auth"
	shared "socialNetwork/shared_packages"
	user "socialNetwork/user"
	"socialNetwork/utils"
)

// Handler /verify
func CheckUserExeting(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var UserID string
		var err error
		if r.URL.String() != "/api/login" && r.URL.String() != "/api/register" {
			token := auth.GetToken(w, r)
			if token == "" {
				utils.Log("ERROR", "Invalid Token in CheckUserExeting Handler--------")
				utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
					Success: false,
					Message: "Please login to continue",
					Error:   "You are not Authorized.",
				})
				return
			}
			fmt.Println("Token: ", token)
			UserID, err = user.GetUserIDByToken(token)
			fmt.Println("UserID: ", UserID)
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
		fmt.Println("Returning ServeHTTP for: ", UserID, r.URL.String())
		next.ServeHTTP(w, r.WithContext(shared.SetContext(r, UserID)))
	})
}
