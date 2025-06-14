package post

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"

	"socialNetwork/auth"
	db "socialNetwork/db/sqlite"
	shared "socialNetwork/shared_packages"
	"socialNetwork/utils"
)

// Example URL : http://localhost:8080/posts/getposts?limit=10&offset=0
// GetPostsScroll is a handler function that handles the GET request to fetch posts with pagination

func PostsPagination(w http.ResponseWriter, r *http.Request) {
	utils.Log("", "Get request made to GetPostsScroll Handler")
	UserID := r.Context().Value(shared.UserIDKey).(string)

	// we will have both, Limit of Posts, and Offset of Posts 10 in our case
	offset := r.URL.Query().Get("offset")
	limit := r.URL.Query().Get("limit")
	specificUser := r.URL.Query().Get("user_id")
	fmt.Println("specificUser", specificUser)
	if offset == "" || limit == "" {
		utils.Log("ERROR", "Offset or Limit is not valid in GetPostsScroll Handler: ")
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "Offset or Limit is not valid",
			Error:   "Please check again",
		})
		return
	}
	Offset, err := strconv.Atoi(offset)
	if err != nil || Offset < 0 {
		utils.Log("ERROR", "Offset is not valid in GetPostsScroll Handler: "+err.Error())
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "Offset is not valid",
			Error:   "Please check again",
		})
		return
	}
	Limit, err := strconv.Atoi(limit)
	if err != nil || Limit <= 0 {
		utils.Log("ERROR", "Limit is not valid in GetPostsScroll Handler: "+err.Error())
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "Limit is not valid",
			Error:   "Please check again",
		})
		return
	}
	// we will get the posts from the database
	Posts := []Post{}
	// Prepare the statement
	query := "SELECT * FROM posts ORDER BY created_at DESC LIMIT ? OFFSET ?"
	if specificUser != "" {
		query = "SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?"
	}
	stmnt, err := db.DB.Prepare(query)
	if err != nil {
		utils.Log("ERROR", "Error Preparing Statment in GetPostsScroll Handler"+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Something went wrong, Please try again later",
			Error:   "Unable to fetch the posts",
		})
		return
	}
	defer stmnt.Close()
	// get the posts from the database
	var rows *sql.Rows
	if specificUser != "" {
		rows, err = stmnt.Query(specificUser, Limit, Offset)
	} else {
		rows, err = stmnt.Query(Limit, Offset)
	}
	if err != nil {
		utils.Log("ERROR", "Error scanning Post in GetPostsScroll Handler: "+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Something went wrong, Please try again later",
			Error:   "Unable to fetch the posts",
		})
		return
	}
	defer rows.Close()
	for rows.Next() {
		Post := Post{}
		Profile := auth.Profile{}
		err = rows.Scan(&Post.PostId, &Post.UserID, &Post.Post_Content, &Post.Post_image, &Post.Privacy, &Post.CreatedAt)
		if err != nil {
			utils.Log("ERROR", "Error scanning Post in GetPostsScroll Handler: "+err.Error())
			utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
				Success: false,
				Message: "Something went wrong, Please try again later",
				Error:   "Unable to fetch the posts",
			})
			return
		}
		// TODO Each Post Must Check if the exist user Has Liked the post or not
		// TODO get Likes count as well
		err = db.DB.QueryRow("SELECT COUNT(*) FROM likes WHERE post_id = ?", Post.PostId).Scan(&Post.LikeCounts)
		err = db.DB.QueryRow("SELECT COUNT(*) FROM comments WHERE post_id = ?", Post.PostId).Scan(&Post.CommentCounts)
		// check the privacy of post,
		stmnt, err := db.DB.Prepare("SELECT first_name, last_name, avatar, profile_status FROM users WHERE id = ?")
		if err != nil {
			utils.Log("ERROR", "Error Preparing Statment When trying to get Profile info of the author in GetPostsScroll Handler"+err.Error())
			// TODO Handler The error of Prepare Statment
			continue
		}
		err = stmnt.QueryRow(Post.UserID).Scan(&Profile.FirstName, &Profile.LastName, &Profile.Avatar, &Profile.Profile_Status)
		if err != nil {
			// TODO Handler The error of Query Row
			utils.Log("ERROR", "Error QueryRow When trying to Execute the row of Profile info of the author in GetPostsScroll Handler"+err.Error())

			continue
		}
		if Profile.Profile_Status == "private" {
			// Check if the User Id Has access to this post,
			var HasAccess bool
			// Check if the User Id Has access to this post,
			err = db.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM followers WHERE followed_id = ? AND follower_id = ?)", Post.UserID, UserID).Scan(&HasAccess)
			if err != nil || !HasAccess {
				continue
			}
		}
		Post.First_name = Profile.FirstName
		Post.Last_name = Profile.LastName
		Post.User_avatar = Profile.Avatar
		Post.Profile_status = Profile.Profile_Status
		// Check if the user has liked the post
		err = db.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM likes WHERE post_id = ? AND user_id = ?)", Post.PostId, UserID).Scan(&Post.Liked)
		if err != nil {
			utils.Log("ERROR", "Error scanning Post in GetPostsScroll Handler: "+err.Error())
			continue
		}

		if Post.Privacy == "custom_users" && Post.UserID != UserID {
			var found bool
			// Check if the User Id Has access to this post,
			err := db.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM post_allowed WHERE post_id = ? AND user_id = ?)", Post.PostId, UserID).Scan(&found)
			if err != nil || !found {
				continue
			}
		} else if Post.Privacy == "followers" && Post.UserID != UserID {
			var follower_status string
			// Check if the User Id Has access to this post,
			stmnt, err := db.DB.Prepare("SELECT follower_status FROM followers WHERE followed_id = ? AND follower_id = ?")
			if err != nil {
				utils.Log("ERROR", "Error Preparing Statment in GetPostsScroll Handler"+err.Error())
				utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
					Success: false,
					Message: "Please try again later",
					Error:   "Please try again later",
				})
				return
			}
			defer stmnt.Close()
			err = stmnt.QueryRow(Post.UserID, UserID).Scan(&follower_status)
			if err != nil || follower_status != "accepted" {
				continue
			}
		}
		// Everything is fine, we can add the post to the list
		Posts = append(Posts, Post)
	}
	// check if there are no posts
	if len(Posts) == 0 {
		utils.Log("ERROR", "No Posts found in GetPostsScroll Handler: ")
		utils.SendJSON(w, http.StatusNotFound, utils.JSONResponse{
			Success: true,
			Message: "You reached the end of the posts",
			Error:   "No Posts found",
		})
		return
	}
	// send the posts to the client
	utils.Log("INFO", "Posts fetched successfully in GetPostsScroll Handler")
	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "Posts fetched successfully",
		Data: map[string]any{
			"posts": Posts,
		},
	})
}
