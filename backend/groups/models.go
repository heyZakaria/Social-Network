package Group

type Group struct {
	AdminId     string
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	CoverName   string `json:"covername"`
	MemberCount int    `json:"memberCount"`
	MemberState string `json:"memberState"`
}
type GroupMember struct {
	User_id   string
	Group_id  int
	FirstName string
	LastName  string
	Avatar    string
	Role      string
}

type Invite struct {
	Id          int
	Sender_id   string
	Reciever_id string
	Group_id    string
	Joinstate   string
}
