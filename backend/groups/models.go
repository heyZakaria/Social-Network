package Group

import (
	"database/sql"
)

type Group struct {
	AdminId     string
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	CoverName   string `json:"covername"`
	MemberCount int    `json:"memberCount"`
	MemberState string `json:"memberState"`
}

type Invite struct {
	Id          int
	Sender_id   sql.NullString
	Reciever_id string
	Group_id    string
	Joinstate   string
}
