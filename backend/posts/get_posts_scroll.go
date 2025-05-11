package post

import (
	"net/http"
	db "socialNetwork/db/sqlite"
	Structs "socialNetwork/struct"
	user "socialNetwork/user"
	"socialNetwork/utils"
	"strconv"
)

// Example URL : http://localhost:8080/api/posts?limit=10&offset=0
// GetPostsScroll is a handler function that handles the GET request to fetch posts with pagination
func GetPostsScroll(w http.ResponseWriter, r *http.Request) {
	utils.Log("", "Get request made to GetPostsScroll Handler")
	_, err := user.GetUserIDByToken(r)
	if err != nil {
		utils.Log("ERROR", "Invalid Token in GetPostsScroll Handler: "+err.Error())
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: "Please login to continue",
			Error:   "You are not Authorized.",
		})
		return
	}
	// we will have both, Limit of Posts, and Offset of Posts 10 in our case
	offset := r.URL.Query().Get("offset")
	limit := r.URL.Query().Get("limit")
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
	Posts := []Structs.Post{}
	// Prepare the statement
	stmnt, err := db.DB.Prepare("SELECT * FROM posts ORDER BY created_at DESC LIMIT ? OFFSET ?")
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
	rows, err := stmnt.Query(Limit, Offset)
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
		Post := Structs.Post{}
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
	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "Posts fetched successfully",
		Data: map[string]any{
			"posts": Posts,
		},
	})
	return
}
