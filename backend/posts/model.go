package post

import "time"

type Post struct {
	PostId         int
	UserID         string
	First_name     string
	Last_name      string
	User_avatar    string
	Profile_status string
	Post_Content   string
	Post_image     string
	Privacy        string
	CreatedAt      *time.Time
	Liked          bool
	LikeCounts     int
	CommentCounts  int
	Comments       []Comment
	AllowedUsers   []string
}

type Comment struct {
	CommentId   int
	UserID      string
	PostID      int
	CommentText string
	CreatedAt   *time.Time
}
