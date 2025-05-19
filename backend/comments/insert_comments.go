package comments

import (
	"fmt"
	"html"

	db "socialNetwork/db/sqlite"
	post "socialNetwork/posts"

	"github.com/gofrs/uuid/v5"
)

func (c *Comment) SaveComment(userID string, postID int, content string) error {
	if !c.PostExist(postID) {
		return fmt.Errorf("post does not exist")
	}

	comment := &Comment{
		ID:      uuid.Must(uuid.NewV4()).String(),
		UserID:  userID,
		PostID:  postID,
		Content: content,
	}
	return c.InsertComment(comment)
}

func (c *Comment) InsertComment(comment *Comment) error {
	var post post.Post

	if !c.PostExist(post.PostId) {
		return fmt.Errorf("post does not exist")
	}

	query := "INSERT INTO comments (id, user_id, post_id, content) VALUES (?, ?, ?, ?)"
	prp, prepareErr := db.DB.Prepare(query)
	if prepareErr != nil {
		return prepareErr
	}
	defer prp.Close()
	comment.Content = html.EscapeString(comment.Content)
	_, execErr := prp.Exec(
		comment.ID,
		comment.UserID,
		comment.PostID,
		comment.Content,
	)
	if execErr != nil {
		return execErr
	}
	return nil
}
