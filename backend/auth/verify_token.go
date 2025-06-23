package auth

import (
	"fmt"
	"net/http"
	"strings"

	Tkn "socialNetwork/token"
	"socialNetwork/utils"
)

func VerifyTokenHandler(w http.ResponseWriter, r *http.Request) {
	utils.Log("INFO", "Verify-token hit")

	auth := r.Header.Get("Authorization") // "Bearer eyJhbGciOi..."
	token := strings.TrimSpace(strings.TrimPrefix(auth, "Bearer"))
	if token == "" {
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: "Token missing",
		})
		return
	}
	fmt.Println("Received auth:", auth)

	fmt.Println("Verifying token:", token)

	if _, err := Tkn.GetUserIDByToken(token); err != nil {
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: "Invalid token",
		})
		return
	}

	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "Token is valid",
	})
}
