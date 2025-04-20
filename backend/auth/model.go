package auth

import "time"

type Profile struct {
	id int
	FirstName string    `json:"firstname"`
	LastName  string    `json:"lastname"`
	Email     string    `json:"email"`
	Password  string    `json:"password"`
	NickName  string    `json:"nickname"`
	Bio       string    `json:"bio"`
	Image     string    `json:"fr"`
	Birthday  time.Time `json:"birthday"`
	Creat_At  time.Time
}

type WriteMessage struct {
	Success string `json:"success"`
}
