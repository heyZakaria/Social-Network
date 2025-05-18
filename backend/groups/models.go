package Group

type Group struct {
	Id          int
	Description string
	Title       string
	Members     []GroupMember
}

type GroupMember struct {
	User_id  string
	Group_id int
}

type GroupMessage struct {
	Group_id  int    `json:"group_id"`
	Message   string `json:"message"`
	Sender_id   string `json:"user_id"`
	CreatedAt string `json:"created_at"`
}
