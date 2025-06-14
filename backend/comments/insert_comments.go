package comments

import (
	"html"

	db "socialNetwork/db/sqlite"

	"github.com/gofrs/uuid/v5"
)

func (c *Comment) SaveComment(userID string) error {
	c.ID = uuid.Must(uuid.NewV4()).String()
	c.UserID = userID
	return c.InsertComment()
}

func (c *Comment) InsertComment() error {
	query := "INSERT INTO comments (id, user_id, post_id, content) VALUES (?, ?, ?, ?)"
	prp, prepareErr := db.DB.Prepare(query)
	if prepareErr != nil {
		return prepareErr
	}
	defer prp.Close()
	c.Content = html.EscapeString(c.Content)
	_, execErr := prp.Exec(
		&c.ID,
		&c.UserID,
		&c.PostID,
		&c.Content,
	)
	if execErr != nil {
		return execErr
	}
	return nil
}
