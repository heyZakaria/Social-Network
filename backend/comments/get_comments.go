package comments

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	db "socialNetwork/db/sqlite"
	"socialNetwork/utils"
)

func (c *Comment) GetCommentByPost(w http.ResponseWriter, r *http.Request) {
	var err error
	postID := r.URL.Query().Get("postId")
	pagination := r.URL.Query().Get("page")
	fmt.Println(pagination, postID)
	nPagination, err := strconv.Atoi(pagination)
	if err != nil {
		fmt.Println(err)
		utils.Log("Error", "have problem to convert to int for pagination")
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "have problem to convert to int for pagination",
		})
		return
	}

	postId, err := strconv.Atoi(postID)
	if err != nil {
		utils.Log("Error", "have problem to convert to int for postID")
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "have problem to convert to int for postID",
		})
		return
	}
	comment, err := c.Getcomments(postId, nPagination)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(comment)
}

func (c *Comment) Getcomments(postID int, pagination int) ([]Comment, error) {
	var querySelect string
	var rows *sql.Rows
	var queryErr error
	if pagination <= 0 {
		querySelect = `
		SELECT
			comments.id AS comment_id,
			comments.content,
			comments.created_at,
			users.id AS user_id
		FROM
			comments
		JOIN
			users ON comments.user_id = users.id
		WHERE
			comments.post_id = ?
		ORDER BY
			comments.created_at DESC
		LIMIT 1;`

		rows, queryErr = db.DB.Query(querySelect, postID)
	} else {
		querySelect = `
		SELECT
			comments.id AS comment_id,
			comments.content,
			comments.created_at,
			users.id AS user_id
		FROM
			comments
		JOIN
			users ON comments.user_id = users.id
		WHERE
			comments.post_id = ?
		ORDER BY
			comments.created_at DESC
		LIMIT ? OFFSET ?;`

		limit := 2
		offset := (pagination - 1) * limit

		rows, queryErr = db.DB.Query(querySelect, postID, limit, offset)
	}
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
		)
		if scanErr != nil {
			return nil, scanErr
		}
		currentComment.FormattedDate = currentComment.CreatedAt.Format("01/02/2006, 3:04:05 PM")
		comments = append(comments, currentComment)
	}
	return comments, nil
}
