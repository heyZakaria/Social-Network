package comments

import (
	"fmt"
	"net/http"
	"strconv"

	db "socialNetwork/db/sqlite"
	shared "socialNetwork/shared_packages"
	"socialNetwork/utils"
)

func GetCommentByPost(w http.ResponseWriter, r *http.Request) {
	UserID := r.Context().Value(shared.UserIDKey).(string)
	if UserID == "" {
		utils.Log("Error", "User ID is not provided in the context")
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: "Unauthorized",
			Error:   "Please Login to fetch comments",
		})
		return
	}
	PostIDString := r.URL.Query().Get("post_id")

	PostID, err := strconv.Atoi(PostIDString)
	if err != nil || PostID <= 0 {
		utils.Log("Error", "Invalid Post ID provided")
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "Invalid Post ID provided",
			Error:   "Post ID must be a positive integer",
		})
		return
	}

	comments, err := Getcomments(PostID)
	if err != nil {
		utils.Log("Error", fmt.Sprintf("Failed to get comments for post ID %d: %s", PostID, err.Error()))
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Failed to get comments",
			Error:   err.Error(),
		})
		return
	}
	if comments == nil {
		utils.Log("Info", fmt.Sprintf("No comments found for post ID %d", PostID))
		utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
			Success: true,
			Message: "No comments found",
			Data:    map[string]interface{}{"Comments": []Comment{}},
		})
		return
	}
	utils.Log("Success", fmt.Sprintf("Comments retrieved successfully for post ID %d", PostID))
	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "Comments retrieved successfully",
		Data: map[string]interface{}{
			"Comments": comments,
		},
	})

}

func Getcomments(postID int) ([]Comment, error) {
	var comments []Comment

	querySelect := `
			SELECT
				comments.id AS comment_id,
				comments.content,
				comments.created_at,
				users.id AS user_id,
				users.first_name,
				users.last_name,
				users.avatar
			FROM
				comments
			JOIN
				users ON comments.user_id = users.id
			WHERE
				comments.post_id = ?
			ORDER BY
				comments.created_at DESC;
`

	rows, err := db.DB.Query(querySelect, postID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var currentComment Comment
		scanErr := rows.Scan(
			&currentComment.ID,
			&currentComment.Content,
			&currentComment.CreatedAt,
			&currentComment.UserID,
			&currentComment.FirstName,
			&currentComment.LastName,
			&currentComment.Avatar,
		)
		if scanErr != nil {
			return nil, scanErr
		}
		currentComment.FormattedDate = currentComment.CreatedAt.Format("01/02/2006, 3:04:05 PM")
		comments = append(comments, currentComment)
	}
	return comments, nil
}
