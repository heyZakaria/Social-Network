package auth

import (
	"net/http"
	"time"

	tkn "socialNetwork/token"
	"socialNetwork/utils"
)

func SendSuccessWithToken(w http.ResponseWriter, r *http.Request, userID string) {
	// second parm not necessary "user", just for respect format of JWT
	// Sould be choose role of user
	token, err := CreateJWT(userID, "user")
	if err != nil {
		utils.Log("ERROR", "Failed to create JWT: "+err.Error())
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Error:   "Internal server error",
		})
		return
	}
	// set cookies manual like we recieve it in graphql
	// w.Header().Set("Authorization", "Bearer "+token)

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
