package auth

import (
	"time"
)

type Profile struct {
	ID        string    `json:"-"`
	FirstName string    `json:"firstname"`
	LastName  string    `json:"lastname"`
	Email     string    `json:"email"`
	Password  string    `json:"password"`
	NickName  string    `json:"nickname"`
	Bio       string    `json:"bio"`
	Avatar    string    `json:"avatar"`
	Birthday  time.Time `json:"birthday"`
	CreatedAt time.Time `json:"-"`
}

type WriteMessage struct {
	Success string `json:"success"`
}
