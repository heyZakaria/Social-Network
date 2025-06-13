package auth

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"net/http"
	"strings"
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

func VerifyJWT(token string) (JWTPayload, error) {
	parts := strings.Split(token, ".")

	if len(parts) != 3 {
		return JWTPayload{}, errors.New("Invalid token format")
	}

	encodedHeader := parts[0]
	encodedPayload := parts[1]
	signature := parts[2]

	payloadJSON, err := base64.URLEncoding.DecodeString(encodedPayload)
	if err != nil {
		return JWTPayload{}, err
	}

	var payload JWTPayload
	err = json.Unmarshal(payloadJSON, &payload)
	if err != nil {
		return JWTPayload{}, err
	}

	expectedSignature := createSignature(encodedHeader, encodedPayload, string(secretKey))

	// secure vs Timing Attack
	// compare indirect
	if !hmac.Equal([]byte(signature), []byte(expectedSignature)) {
		return JWTPayload{}, errors.New("Invalid signature")
	}

	if time.Now().Unix() > payload.Exp {
		return JWTPayload{}, errors.New("token has expired")
	}
	return payload, nil
}

func GetToken(w http.ResponseWriter, r *http.Request) (token string) {
	cookie, err := r.Cookie("token")
	if err != nil {
		utils.Log("ERROR", "Token cookie is missing in GetToken")
		return ""
	}

	return cookie.Value
}
