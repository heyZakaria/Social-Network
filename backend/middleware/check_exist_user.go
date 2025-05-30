package middleware

import (
	"context"
	"fmt"
	"net/http"

	"socialNetwork/auth"
	user "socialNetwork/user"
	"socialNetwork/utils"
)
const UserIDKey = "userID"
type UserID string

// Handler /verify
func CheckUserExeting(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
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
		UserID, err := user.GetUserIDByToken(token)
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
		ctx := context.WithValue(r.Context(), UserIDKey, UserID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}