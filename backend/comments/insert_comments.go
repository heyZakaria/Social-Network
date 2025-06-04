package comments

import (
	"html"

	db "socialNetwork/db/sqlite"

	"github.com/gofrs/uuid/v5"
)

func (c *Comment) SaveComment(userID string, postID int, content string) error {
	comment := &Comment{
		ID:      uuid.Must(uuid.NewV4()).String(),
		UserID:  userID,
		PostID:  postID,
		Content: content,
	}
	return c.InsertComment(comment)
}

func (c *Comment) InsertComment(comment *Comment) error {
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
