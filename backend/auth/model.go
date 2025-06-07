package auth

import (
	"time"
)

var secretKey = []byte("Y&8vBx2!r4@LmP7qZpN1*Eg5Km%VcX0t")

type Profile struct {
	UserID         string    `json:"id"`
	FirstName      string    `json:"firstname"`
	LastName       string    `json:"lastname"`
	Email          string    `json:"email"`
	Password       string    `json:"password"`
	NickName       string    `json:"nickname"`
	Bio            string    `json:"bio"`
	Avatar         string    `json:"avatar"`
	Profile_Status string    `json:"profile_status"`
	Birthday       time.Time `json:"birthday"`
	CreatedAt      time.Time
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
