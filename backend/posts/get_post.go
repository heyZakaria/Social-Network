package post

import (
	"fmt"
	"net/http"
	db "socialNetwork/db/sqlite"
	Structs "socialNetwork/struct"
	"socialNetwork/user"
	"socialNetwork/utils"
	"strconv"
)

func GetPost(w http.ResponseWriter, r *http.Request) {
	utils.Log("", "Get request made to GetPost Handler")
	UserId, err := user.GetUserIDByToken(r)
	if err != nil {
		utils.Log("ERROR", "Not Authorized request, to get this post")
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: err.Error(),
			Error:   "You are not Authorized",
		})
		return
	}

	id := r.URL.Query().Get("id")
	PostId, err := strconv.Atoi(id)
	if err != nil || PostId <= 0 {
		utils.Log("ERROR", "Incorrect Post ID")
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "The requested Post is not available",
			Error:   "Please check again",
		})
		return
	}
	// Check Post Status

	// SaveAllowedUsers
	// type Post struct {
	// 	UserID       string
	// 	Post         string
	// 	Post_image   string
	// 	Privacy      string
	// 	AllowedUsers []string
	// }
	// TODO Check the Post Privacy
	Post := Structs.Post{}
	// get Post First
	stmnt, err := db.DB.Prepare("SELECT * FROM posts WHERE id = ?")
	if err != nil {
		utils.Log("ERROR", "Error Preparing Statment in GetPost Handler"+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Please try again later",
			Error:   err.Error(),
		})
		return
	}
	defer stmnt.Close()
	err = stmnt.QueryRow(PostId).Scan(&PostId, &Post.UserID, &Post.Post_Content, &Post.Post_image, &Post.Privacy, &Post.CreatedAt)
	if err != nil {
		utils.Log("ERROR", "Error scanning Post in GetPost Handler: "+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Unable to fetch the post",
			Error:   err.Error(),
		})
		return
	}
	if Post.Privacy == "custom_users" {
		var post_id int
		var user_id string
		// Check if the User Id Has access to this post,
		rows := db.DB.QueryRow("SELECT * FROM post_allowed WHERE post_id = ? AND user_id = ?", PostId, UserId)
		err := rows.Scan(&post_id, &user_id)
		if err != nil {
			// TODO Handle ERror
			fmt.Println("you are not Authorized to get this Post")
			return
		}
	}
	// if its public, no restriction
	// if its for Followers, We have to check the current user
	//  if he followes the Post Owner
	// if is set to Costum, we need to check approved users table
	fmt.Println("ids ID ", id)
	fmt.Println("Post ID ", PostId)
	fmt.Println("Post = ", Post)
	_ = UserId

}
