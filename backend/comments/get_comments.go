package comments

import (
	db "socialNetwork/db/sqlite"
)

func (c *Comment) GetCommentByPost(postID int, pagination int) ([]Comment, error) {
	comment, err := c.Getcomments(postID, pagination)
	if err != nil {
		return nil, err
	}
	return comment, nil
}

func (c *Comment) Getcomments(postID string, pagination int) ([]Comment, error) {
	querySelect := `
	SELECT
	 comments.id AS comment_id,
	 comments.content,
	 comments.created_at,
	 users.id AS user_id,
	 users.username,
	 COUNT(*) OVER() AS total_count
	FROM 
	 comments
	JOIN
	 users ON comments.user_id = users.id
	WHERE
	 comments.post_id = ?
	ORDER BY
	 comments.created_at DESC
	 LIMIT 2 OFFSET ?;`

	rows, queryErr := db.DB.Query(querySelect, postID, pagination)
	if queryErr != nil {
		return nil, queryErr
	}
	defer rows.Close()
	var comments []Comment
	for rows.Next() {
		var currentComment Comment
		scanErr := rows.Scan(
			&currentComment.ID,
			&currentComment.Content,
			&currentComment.CreatedAt,
			&currentComment.UserID,
			&currentComment.Username,
			&currentComment.TotalCount,
		)
		if scanErr != nil {
			return nil, scanErr
		}
		currentComment.FormattedDate = currentComment.CreatedAt.Format("01/02/2006, 3:04:05 PM")
		comments = append(comments, currentComment)
	}
	return comments, nil
}
