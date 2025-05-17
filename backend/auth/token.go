package auth

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"net/http"
	db "socialNetwork/db/sqlite"
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

func GetToken(w http.ResponseWriter, r *http.Request) (token string, err error) {
	token = r.Header.Get("Authorization")
	if token == "" {
		err = errors.New("Authorization header is missing")
		return
	}

	// Extract the token value from "Bearer <token>"

	if len(token) > 7 && token[:7] == "Bearer " {
		token = token[7:]
	} else {
		err = errors.New("Invalid Authorization header format")
		return
	}
	err = nil
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
