package auth

import (
	"net/http"
	"socialNetwork/chat"
	shared "socialNetwork/shared_packages"
	"socialNetwork/token"
	"socialNetwork/utils"
)

func HandleLogout(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(shared.UserIDKey).(string)
	if conn, ok := chat.Clients[userID]; ok && conn != nil {
		// If the user is connected to a chat, close the connection
		conn.Conn.Close()
		delete(chat.Clients, userID)
		utils.Log("INFO", "Chat connection closed for user: "+userID)
	}
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
