package comments

import (
	"time"
)

type Comment struct {
	ID            string
	UserID        string
	PostID        int    `json:"postId"`
	Content       string `json:"content"`
	FirstName     string
	LastName      string
	Avatar        string
	CreatedAt     time.Time
	FormattedDate string
}
