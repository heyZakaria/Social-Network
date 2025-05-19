package comments

import (
	"encoding/json"
	"net/http"

	db "socialNetwork/db/sqlite"
	"socialNetwork/utils"
)

func (c *Comment) GetCommentByPost(w http.ResponseWriter, r *http.Request) {
	comment, err := c.Getcomments(c.PostID, 0)
	if err != nil {
		utils.Log("Error", "have problem in post id or pagination!!! ")
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "have problem in post id or pagination!!!",
		})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(comment)
}

func (c *Comment) Getcomments(postID int, pagination int) ([]Comment, error) {
	// querySelect := `
	// SELECT
	//  comments.id AS comment_id,
	//  comments.content,
	//  comments.created_at,
	//  users.id AS user_id,
	//  users.username,
	// FROM
	//  comments
	// JOIN
	//  users ON comments.user_id = users.id
	// WHERE
	//  comments.post_id = ?
	// ORDER BY
	//  comments.created_at DESC
	//  LIMIT 2 OFFSET ?;`

	x, err := db.DB.Prepare("SELECT * FROM comments WHERE post_id = ? AND user_id = ?")
	_ = err
	rows, queryErr := x.Query(postID, c.UserID)
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
		)
		if scanErr != nil {
			return nil, scanErr
		}
		currentComment.FormattedDate = currentComment.CreatedAt.Format("01/02/2006, 3:04:05 PM")
		comments = append(comments, currentComment)
	}
	return comments, nil
}
