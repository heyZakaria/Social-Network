package likes

import (
	"net/http"
	"strconv"

	"socialNetwork/comments"
	db "socialNetwork/db/sqlite"
	shared "socialNetwork/shared_packages"
	"socialNetwork/utils"
)

func LikePost(w http.ResponseWriter, r *http.Request) {
	// Logging the start of the LikePost Handler
	UserId := r.Context().Value(shared.UserIDKey).(string)

	// Getting the post ID from the query parameters
	id := r.URL.Query().Get("id")
	PostId, err := strconv.Atoi(id)
	if err != nil {
		utils.Log("ERROR", "Post ID is not valid in LikePost Handler: "+err.Error())
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "Post ID is not valid",
			Error:   "Please check again",
		})
		return
	}
	Comment := comments.Comment{}
	err = Comment.IsPostExist(PostId, UserId)
	if err != nil {
		utils.Log("Error", "doesn't exist this post"+err.Error())
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "the post doesn't exist or you don't have permission to react on it",
			Error:   err.Error(),
		})
		return
	}
	// Check if the post has been liked by the current user
	stmnt, err := db.DB.Prepare("SELECT is_liked FROM likes WHERE post_id = ? AND user_id = ?")
	if err != nil {
		utils.Log("ERROR", "Error Preparing Statment in LikePost Handler"+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Something went wrong, Please try again later",
			Error:   "Unable to fetch the post",
		})
		return
	}
	defer stmnt.Close()

	var isLiked bool
	var likeStatus string
	err = stmnt.QueryRow(PostId, UserId).Scan(&isLiked)
	if err != nil && err.Error() != "sql: no rows in result set" {
		utils.Log("ERROR", "Error scanning Post in LikePost Handler: "+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Something went wrong, Please try again later",
			Error:   "Unable to fetch the post",
		})
		return
	}
	// If the post is already liked, we will unlike it
	if isLiked {
		likeStatus = "Unliked"
		_, err = db.DB.Exec("DELETE FROM likes WHERE post_id = ? AND user_id = ?", PostId, UserId)
		if err != nil {
			utils.Log("ERROR", "Error deleting like in LikePost Handler: "+err.Error())
			utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
				Success: false,
				Message: "Something went wrong, Please try again later",
				Error:   "Unable to unlike the post",
			})
			return
		}
	} else {
		// If the post is not liked, we will like it
		likeStatus = "Liked"
		_, err = db.DB.Exec("INSERT INTO likes (post_id, user_id) VALUES (?, ?)", PostId, UserId)
		if err != nil {
			utils.Log("ERROR", "Error inserting like in LikePost Handler: "+err.Error())
			utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
				Success: false,
				Message: "Something went wrong, Please try again later",
				Error:   "Unable to like the post",
			})
			return
		}
	}

	// After liking or unliking the post, we will get the updated like count
	var likeCount int
	err = db.DB.QueryRow("SELECT COUNT(*) FROM likes WHERE post_id = ?", PostId).Scan(&likeCount)
	if err != nil {
		utils.Log("ERROR", "Error getting like count in LikePost Handler: "+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Something went wrong, Please try again later",
			Error:   "Unable to fetch the like count",
		})
		return
	}
	// Log the like count and send the response
	utils.Log("INFO", "Like count for post ID "+strconv.Itoa(PostId)+" is "+strconv.Itoa(likeCount))
	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "Post " + likeStatus + " successfully",
		Data: map[string]any{
			"like_count": likeCount,
		},
	})
	utils.Log("INFO", "Success LikePost Handler")
}
