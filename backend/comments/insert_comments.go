package comments

import (
	"fmt"
	"html"

	db "socialNetwork/db/sqlite"

	"github.com/gofrs/uuid/v5"
)

func (c *Comment) SaveComment(userID string, postId int) error {
	// ganerate uuid for comment
	c.ID = uuid.Must(uuid.NewV4()).String()
	c.PostID = postId
	c.UserID = userID
	return c.InsertComment()
}

// this func for insert comment in data base
func (c *Comment) InsertComment() error {
	// prepare query to insert comment
	query := "INSERT INTO comments (id, user_id, post_id, comment_img, content) VALUES (?, ?, ?, ?, ?)"
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
		&c.Comment_img,
		&c.Content,
	)
	if execErr != nil {
		return execErr
	}
	return nil
}

func (c *Comment) IsPostExist(postId int) error {
	var num int
	query := `SELECT COUNT(*) FROM posts WHERE id = ?`
	row := db.DB.QueryRow(query, postId)
	err := row.Scan(&num)
	if err != nil {
		return err
	}
	if num == 1 {
		return nil
	}
	return fmt.Errorf("post with id %d does not exist", postId)
}
