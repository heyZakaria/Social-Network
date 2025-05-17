package post

import (
	"time"
)

type Post struct {
	PostId        int
	UserID        string
	Post_Content  string
	Post_image    string
	Privacy       string
	CreatedAt     *time.Time
	Liked         bool
	LikeCounts    int
	CommentCounts int
	Comments      []Comment
	AllowedUsers  []string
}

type Comment struct {
	ID        int
	UserID    string
	PostID    int
	Content   string
	CreatedAt time.Time
}

type CommentData struct {
	Comment string `json:"content"`
	PostId  string `json:"postId"`
}
