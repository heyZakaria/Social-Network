package token

import (
	"net/http"

	"socialNetwork/utils"
)

func GetToken(w http.ResponseWriter, r *http.Request) (token string) {
	cookie, err := r.Cookie("token")
	if err != nil {
		utils.Log("ERROR", "Token cookie is missing in GetToken")
		return ""
	}

	return cookie.Value
}
