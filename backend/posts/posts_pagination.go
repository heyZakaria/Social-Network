package post

import (
	"database/sql"
	"net/http"
	"strconv"

	"socialNetwork/auth"
	db "socialNetwork/db/sqlite"
	shared "socialNetwork/shared_packages"
	"socialNetwork/utils"
)

func PostsPagination(w http.ResponseWriter, r *http.Request) {
	utils.Log("", "Get request made to GetPostsScroll Handler")
	UserID := r.Context().Value(shared.UserIDKey).(string)

	// Get Params
	// Check if the group_id, offset, limit and specific user are valid
	Offset, Limit, GroupId, specificUser, shouldReturn := validatePaginationParams(w, r)
	if shouldReturn {
		return
	}
	// Initialize the Post struct
	Posts := []Post{}
	// By Default we are Getting all posts in table
	query := "SELECT * FROM posts  WHERE  group_id IS NULL ORDER BY created_at DESC LIMIT ? OFFSET ?"
	if specificUser != "" {
		// In case there is a request to specific user, we are getting posts of that user exact
		query = "SELECT * FROM posts WHERE user_id = ? AND group_id IS NULL  ORDER BY created_at DESC LIMIT ? OFFSET ?"
	} else if GroupId != "" {
		// if the groupid provided we are getting posts related to that group
		query = "SELECT * FROM posts WHERE group_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?"
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
	} else if GroupId != "" {
		rows, err = stmnt.Query(GroupId, Limit, Offset)
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
		err = rows.Scan(&Post.PostId, &Post.UserID, &Post.Post_Content, &Post.Post_image, &Post.Privacy, &Post.Group_id, &Post.CreatedAt)
		if err != nil {
			utils.Log("ERROR", "Error scanning Post in GetPostsScroll Handler: "+err.Error())
			utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
				Success: false,
				Message: "Something went wrong, Please try again later",
				Error:   "Unable to fetch the posts",
			})
			return
		}

		// Get the like and comment counts for the post
		err = db.DB.QueryRow("SELECT COUNT(*) FROM likes WHERE post_id = ?", Post.PostId).Scan(&Post.LikeCounts)
		err = db.DB.QueryRow("SELECT COUNT(*) FROM comments WHERE post_id = ?", Post.PostId).Scan(&Post.CommentCounts)
		// check the privacy of post,
		stmnt, err := db.DB.Prepare("SELECT first_name, last_name, avatar, profile_status FROM users WHERE id = ?")
		if err != nil {
			utils.Log("ERROR", "Error Preparing Statment When trying to get Profile info of the author in GetPostsScroll Handler"+err.Error())
			continue
		}
		err = stmnt.QueryRow(Post.UserID).Scan(&Profile.FirstName, &Profile.LastName, &Profile.Avatar, &Profile.Profile_Status)
		if err != nil {
			utils.Log("ERROR", "Error QueryRow When trying to Execute the row of Profile info of the author in GetPostsScroll Handler"+err.Error())
			continue
		}
		if Profile.Profile_Status == "private" && UserID != Post.UserID {
			// Check if the User Id Has access to this post,
			var HasAccess bool
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
		utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
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

func validatePaginationParams(w http.ResponseWriter, r *http.Request) (int, int, string, string, bool) {
	// Get the group_id, offset, limit and specific user from the URL query parameters
	GroupId := r.URL.Query().Get("group_id")
	offset := r.URL.Query().Get("offset")
	limit := r.URL.Query().Get("limit")
	specificUser := r.URL.Query().Get("user_id")

	if offset == "" || limit == "" {
		utils.Log("ERROR", "Offset or Limit is not valid in GetPostsScroll Handler: ")
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "Offset or Limit is not valid",
			Error:   "Please check again",
		})
		return 0, 0, "", "", true
	}
	Offset, err := strconv.Atoi(offset)
	if err != nil || Offset < 0 {
		utils.Log("ERROR", "Offset is not valid in GetPostsScroll Handler: "+err.Error())
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "Offset is not valid",
			Error:   "Please check again",
		})
		return 0, 0, "", "", true
	}
	Limit, err := strconv.Atoi(limit)
	if err != nil || Limit <= 0 {
		utils.Log("ERROR", "Limit is not valid in GetPostsScroll Handler: "+err.Error())
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "Limit is not valid",
			Error:   "Please check again",
		})
		return 0, 0, "", "", true
	}
	return Offset, Limit, GroupId, specificUser, false
}
