package auth

import (
	"net/http"
	"socialNetwork/utils"
)

func HandleLogout(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    "",
		Path:     "/login",
		MaxAge:   -1,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})
	utils.Log("INFO", "User logged out and token cookie cleared")

	SendJSON(w, http.StatusOK, JSONResponse{
		Success: true,
		Message: "Logged out successfully",
	})
}
