package post

import (
	"net/http"
	"strconv"

	db "socialNetwork/db/sqlite"
	shared "socialNetwork/shared_packages"
	"socialNetwork/utils"
)

func GetPost(w http.ResponseWriter, r *http.Request) {
	utils.Log("", "Get request made to GetPost Handler")
	// Get Current USER
	UserId := r.Context().Value(shared.UserIDKey).(string)

	// Get Post ID from the URL query parameters
	id := r.URL.Query().Get("id")
	PostId, err := strconv.Atoi(id)
	// Check if the Post ID is valid
	if err != nil || PostId <= 0 {
		utils.Log("ERROR", "Post ID is not valid in GetPost Handler: "+err.Error())
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "Post ID is not valid",
			Error:   "Please check again",
		})
		return
	}
	// Initialize the Post struct
	Post := Post{}
	// Prepare the SQL statement to get the post
	utils.Log("INFO", "Preparing SQL statement to get the post in GetPost Handler")
	stmnt, err := db.DB.Prepare("SELECT * FROM posts WHERE id = ?")
	if err != nil {
		utils.Log("ERROR", "Error Preparing Statment in GetPost Handler"+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Something went wrong, Please try again later",
			Error:   "Unable to fetch the post",
		})
		return
	}
	defer stmnt.Close()

	// Execute the SQL statement to get the post
	err = stmnt.QueryRow(PostId).Scan(&Post.PostId, &Post.UserID, &Post.Post_Content, &Post.Post_image, &Post.Privacy, &Post.CreatedAt)
	if err != nil {
		utils.Log("ERROR", "Error scanning Post in GetPost Handler: "+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Something went wrong, Please try again later",
			Error:   "Unable to fetch the post",
		})
		return
	}
	// Check the post status (public, custom_users, followers)
	if Post.Privacy == "custom_users" {
		var found bool
		// Check if the User Id Has access to this post,
		err := db.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM post_allowed WHERE post_id = ? AND user_id = ?)", PostId, UserId).Scan(&found)
		if err != nil && Post.UserID != UserId || !found {
			utils.Log("ERROR", "Error scanning Post in GetPost Handler")
			utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
				Success: false,
				Message: "You are not authorized to get this post",
				Error:   "You are not authorized to get this post",
			})
			return
		}
	} else if Post.Privacy == "followers" && Post.UserID != UserId {
		var follower_status string
		// Check if the User Id Has access to this post,
		stmnt, err := db.DB.Prepare("SELECT follower_status FROM followers WHERE followed_id = ? AND follower_id = ?")
		if err != nil {
			utils.Log("ERROR", "Error Preparing Statment in GetPost Handler"+err.Error())
			utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
				Success: false,
				Message: "Please try again later",
				Error:   "Please try again later",
			})
			return
		}
		defer stmnt.Close()

		err = stmnt.QueryRow(Post.UserID, UserId).Scan(&follower_status)
		if err != nil {
			utils.Log("ERROR", "Unauthorized request made to post id:."+id+err.Error())
			utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
				Success: false,
				Message: "Only followers can see this post",
				Error:   "Only followers can see this post",
			})
			return
		}
		if follower_status != "accepted" { // 'pending' or 'rejected'
			utils.Log("ERROR", "Unauthorized request made to this post:.")
			utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
				Success: false,
				Message: "You are not authorized to get this post",
				Error:   "You are not authorized to get this post",
			})
			return
		}
	}
	// Everything is fine, send the post
	utils.Log("INFO", "Post fetched successfully in GetPost Handler")
	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Data: map[string]any{
			"Post": Post,
		},
	})
}
