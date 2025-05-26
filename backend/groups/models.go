package Group

type Group struct {
	Id          int
	Description string
	Title       string
	Members     []GroupMember
	CoverName   string
	AdminId     string
}

type GroupMember struct {
	User_id  string
	Group_id int
}
