package comments

import db "socialNetwork/db/sqlite"

func (c *Comment) PostExist(postID int) bool {
	var num int
	query := `SELECT COUNT(*) FROM posts WHERE id = ?`
	row := db.DB.QueryRow(query, postID)
	err := row.Scan(&num)
	if err != nil {
		return false
	}
	if num == 1 {
		return true
	}
	return false
}
