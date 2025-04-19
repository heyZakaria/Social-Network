package auth

type Profile struct {
	FirstName string `json:"firstname"`
	LastName  string `json:"lastname"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	NickName  string `json:"nickname"`
	Bio       string `json:"bio"`
}

type WriteMessage struct {
	Success string `json:"success"`
}
