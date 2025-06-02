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