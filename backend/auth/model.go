package auth

import (
	"time"
)

var secretKey = []byte("Y&8vBx2!r4@LmP7qZpN1*Eg5Km%VcX0t")

type Profile struct {
	FirstName string    `json:"firstname"`
	LastName  string    `json:"lastname"`
	Email     string    `json:"email"`
	Password  string    `json:"password"`
	NickName  string    `json:"nickname"`
	Bio       string    `json:"bio"`
	Avatar    string    `json:"avatar"`
	Birthday  time.Time `json:"birthday"`
}

type JSONResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message,omitempty"`
	Error   string `json:"error,omitempty"`
	Token   string `json:"token,omitempty"`
}

type JWTPayload struct {
	UserID string `json:"user_id"`
	Role   string `json:"role"`
	Exp    int64  `json:"exp"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
