package auth

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"net/http"
	"time"

	"socialNetwork/utils"
)

func CreateJWT(userID, role string) (string, error) {
	expirationTime := time.Now().Add(time.Hour * 24).Unix()
	payload := JWTPayload{
		UserID: userID,
		Role:   role,
		Exp:    expirationTime,
	}

	payloadJSON, err := json.Marshal(payload)
	if err != nil {
		return "", err
	}
	encodedPayload := base64.URLEncoding.EncodeToString(payloadJSON)

	header := map[string]string{
		"alg":  "HS256",
		"type": "JWT",
	}
	headerJSON, err := json.Marshal(header)
	if err != nil {
		return "", err
	}
	encodeHeader := base64.URLEncoding.EncodeToString(headerJSON)

	signature := createSignature(encodeHeader, encodedPayload, string(secretKey))

	token := encodeHeader + "." + encodedPayload + "." + signature

	return token, nil
}

func createSignature(header, payload, secretKey string) string {
	data := header + "." + payload

	h := hmac.New(sha256.New, []byte(secretKey))
	h.Write([]byte(data))

	signature := base64.URLEncoding.EncodeToString(h.Sum(nil))
	return signature
}

func GetToken(w http.ResponseWriter, r *http.Request) (token string) {
	cookie, err := r.Cookie("token")
	if err != nil {
		utils.Log("ERROR", "Token cookie is missing in GetToken")
		return ""
	}

	return cookie.Value
}
