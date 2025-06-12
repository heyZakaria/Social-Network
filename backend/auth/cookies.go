package auth

import (
	"net/http"
	"time"

	tkn "socialNetwork/token"
	"socialNetwork/utils"

	"github.com/google/uuid"
)

func SendSuccessWithToken(w http.ResponseWriter, r *http.Request, userID string) {

	token := uuid.New().String() // TODO Looking for BEST Way to generate the Session ID :D

	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    token,
		Path:     "/",
		HttpOnly: true,

		Secure: false,

		// secure vs CSRF attacks (Cross Site Request Forgery)
		SameSite: http.SameSiteStrictMode,
		Expires:  time.Now().Add(time.Hour * 24),
	})

	utils.Log("INFO", "Save Token into Sessions")
	tkn.SaveToken(userID, token)

	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "Login successful",
		Token:   token,
	})
	// Return success response with token
	utils.Log("INFO", "Login successful for user: "+userID)
}
