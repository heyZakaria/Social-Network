package auth

import (
	"net/http"

	"socialNetwork/utils"
)

func GetTokenHandler(w http.ResponseWriter, r *http.Request) {
	token := GetToken(w, r)
	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "Token retrieved",
		Data:    map[string]interface{}{"token": token},
	})
}
