package likes

import (
	"net/http"
	"socialNetwork/auth"
	db "socialNetwork/db/sqlite"
	"socialNetwork/user"
	"socialNetwork/utils"
	"strconv"
)
// http://localhost:8080/likes/react?id=1
func LikePost(w http.ResponseWriter, r *http.Request) {
	token := auth.GetToken(w, r)
	UserId, err := user.GetUserIDByToken(token)
	if err != nil {
		utils.Log("ERROR", "Invalid Token in LikePost Handler: "+err.Error())
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: "Please login to continue",
			Error:   "You are not Authorized.",
		})
		return
	}
	// TODO Get Post ID
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
	// TODO Check The Post ID if Its liked by the user already or not
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
	if (err != nil && err.Error() != "sql: no rows in result set"){
		utils.Log("ERROR", "Error scanning Post in LikePost Handler: "+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Something went wrong, Please try again later",
			Error:   "Unable to fetch the post",
		})
		return
	}
	if isLiked {
		// TODO Unlike the post
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
		// TODO Like the post
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

	// TODO Get the number of likes for the post
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
