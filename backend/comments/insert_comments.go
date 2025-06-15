package comments

import (
	"fmt"
	"html"

	db "socialNetwork/db/sqlite"

	"github.com/gofrs/uuid/v5"
)

func (c *Comment) SaveComment(userID string, postId int) error {
	fmt.Println("===========", postId)
	c.ID = uuid.Must(uuid.NewV4()).String()
	c.PostID = postId
	c.UserID = userID
	return c.InsertComment()
}

func (c *Comment) InsertComment() error {
	fmt.Println("======hhhhhhhhhhh=====", c.Comment_img)
	query := "INSERT INTO comments (id, user_id, post_id, comment_img, content) VALUES (?, ?, ?, ?, ?)"
	prp, prepareErr := db.DB.Prepare(query)
	if prepareErr != nil {
		fmt.Println("khlaaaaaaaaaaaaaaaaaak", prepareErr)
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
