package auth

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"net/http"
	db "socialNetwork/db/sqlite"
	"socialNetwork/utils"
	"strings"
	"time"
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
	token = r.Header.Get("Authorization")
	if token == "" {
		utils.Log("ERROR", "Authorization header is missing in GetToken Handler")
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: "Authorization header is missing",
			Error:   "You are not Authorized.",
		})
		return
	}

	// Extract the token value from "Bearer <token>"
	if len(token) > 7 && token[:7] == "Bearer " {
		token = token[7:]
	} else {
		utils.Log("ERROR", "Invalid Authorization header format in CheckUserExeting Handler")
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: "Invalid Authorization header format",
			Error:   "You are not Authorized.",
		})
		return
	}
	return
}

func SaveToken(userID string, token string) error {
	// Check for old sessions and delete them
	deleteQuery := "DELETE FROM sessions WHERE user_id = ?"
	_, err := db.DB.Exec(deleteQuery, userID)
	if err != nil {
		return err // Handle the error appropriately
	}

	// Insert the new session
	insertQuery := `
		INSERT INTO sessions (user_id, token, expiration_time)
		VALUES (?, ?, ?)
	`
	expirationTime := time.Now().Add(24 * time.Hour)
	_, err = db.DB.Exec(insertQuery, userID, token, expirationTime)
	return err
}
