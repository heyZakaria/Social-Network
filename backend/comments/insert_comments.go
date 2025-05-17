package post

// import (
// 	"fmt"
// 	"html"
// 	db "socialNetwork/db/sqlite"
// )

// func (c *Post) InsertComment(comment *Comment) error {
// 	if !c.PostExist(Post.PostId) {
// 		return fmt.Errorf("post does not exist")
// 	}

// 	query := "INSERT INTO comments (id, user_id, post_id, content) VALUES (?, ?, ?, ?)"
// 	prp, prepareErr := db.DB.Prepare(query)
// 	if prepareErr != nil {
// 		return prepareErr
// 	}
// 	defer prp.Close()
// 	comment.Content = html.EscapeString(comment.Content)
// 	_, execErr := prp.Exec(
// 		comment.ID,
// 		comment.UserID,
// 		comment.PostID,
// 		comment.Content,
// 	)
// 	if execErr != nil {
// 		return execErr
// 	}
// 	return nil
// }

// func (c *Post) PostExist(postID string) bool {
// 	var num int
// 	query := `SELECT COUNT(*) FROM posts WHERE id = ?`
// 	row := db.DB.QueryRow(query, postID)
// 	err := row.Scan(&num)
// 	if err != nil {
// 		return false
// 	}
// 	if num == 1 {
// 		return true
// 	}
// 	return false
// }
