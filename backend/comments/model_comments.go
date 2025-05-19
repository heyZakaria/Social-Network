package comments

import (
	"time"
)

type Comment struct {
	ID        string
	UserID    string
	PostID    int
	Username  string
	Content   string
	CreatedAt time.Time
	FormattedDate      string
}

type CommentData struct {
	Comment string `json:"content"`
	PostID  int    `json:"postId"`
}

	