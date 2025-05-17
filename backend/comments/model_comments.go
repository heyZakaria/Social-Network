package comments

import (
	"time"

	"github.com/google/uuid"
)

type Comment struct {
	ID        uuid.UUID
	UserID    string
	PostID    int
	Content   string
	CreatedAt time.Time
}

type CommentData struct {
	Comment string `json:"content"`
	PostID  int    `json:"postId"`
}
