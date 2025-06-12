package auth

import (
	"time"
)

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

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
