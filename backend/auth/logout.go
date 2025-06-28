package auth

import (
	"net/http"
	shared "socialNetwork/shared_packages"
	"socialNetwork/token"
	"socialNetwork/utils"
)

func HandleLogout(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(shared.UserIDKey).(string)
	// remove the user session from the database
	token.DeleteSession(userID)
	// Clear the token cookie
	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    "",
		Path:     "/login",
		MaxAge:   -1,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})
	utils.Log("INFO", "User logged out and token cookie cleared")

	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "Logged out successfully",
	})
}
