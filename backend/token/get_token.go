package token

import (
	"fmt"
	"net/http"

	"socialNetwork/utils"
)

func GetToken(w http.ResponseWriter, r *http.Request) (token string) {
	cookie, err := r.Cookie("token")
	if err != nil {
		utils.Log("ERROR", "Token cookie is missing in GetToken")
		fmt.Println("ERROR", "Token cookie is missing in GetToken", err, "cookie")
		return ""
	}

	return cookie.Value
}
