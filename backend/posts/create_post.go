package post

import (
	"net/http"
	"strings"

	shared "socialNetwork/shared_packages"
	"socialNetwork/utils"
)

// Example URL: http://localhost:8080/posts/createpost
// CreatePost is a handler function that handles the POST request to create a new post.
// It also checks if the user is logged in by validating the token.
// Below is the list of inputs expected in the request:
// "post_content"      (required) > Input text containing the full post content.
// "post_privacy"      (required) > Has three options to choose from: "public", "custom_users", or "followers".
// "post_image"        (optional) > File containing the image that the user selected.
// "allowed_users"     (optional, depends on post_privacy) > Only required if "post_privacy = custom_users".
//
//	This should be a list (array) of user IDs allowed to see the post.
//
// The function returns the post details in JSON format.

var RateLimit = map[string]utils.LimitInfo{}

func CreatePost(w http.ResponseWriter, r *http.Request) {
	PostData := Post{}
	UserId := r.Context().Value(shared.UserIDKey).(string)

	PostData.UserID = UserId
	utils.Log("", "Start Creating the Post")
	Privacy := map[string]bool{
		"public":       true,
		"custom_users": true,
		"followers":    true,
	}
	GroupId := r.URL.Query().Get("group_id")
	if GroupId != "" {
		PostData.Group_id = &GroupId
	}
	r.ParseMultipartForm(10 << 20)

	ImageProvided, postImage, file, err := utils.PrepareImage(r, "post_image", "posts")
	PostData.Post_image = postImage
	if err != nil {
		utils.Log("ERROR", "Error Trying to Prepare Image: "+postImage)
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Error:   "Error While Preparing Image, Please try again later.",
			Message: "Error occured Please try again later. " + err.Error(),
		})
		return
	}

	PostData.Post_Content = r.FormValue("post_content")
	PostData.Post_Content = strings.Trim(PostData.Post_Content, " ")
	if PostData.Post_Content == "" && postImage == "" {
		utils.Log("ERROR", "Post Content is Empty")
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Error:   "Post content is required to create a post",
			Message: "Post content is required to create a post",
		})
		return
	}
	PostData.Privacy = r.FormValue("post_privacy")
	if !Privacy[PostData.Privacy] {
		utils.Log("ERROR", "Error On the Privacy Mode user selected : "+PostData.Privacy)
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Error:   "Please Check the privacy of your Post.",
			Message: "Please Check the privacy of your Post.",
		})
		return
	}

	// Check Rate Limit for the user
	shouldReturn := utils.CheckRateLimit(RateLimit, UserId, w)
	if shouldReturn {
		return
	}

	last_id, err := PostData.InsertPost()
	if err != nil {
		utils.Log("ERROR", "Error Trying to save post into db")
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Error Inserting Post, Try again later.",
			Error:   "Internal Server Error, Try again later.",
		})
		return
	}

	// Save The post ID with Users Allowed to see the post in Post-Allowed
	//  Table in database
	if PostData.Privacy == "custom_users" {
		r.ParseForm()
		PostData.AllowedUsers = r.Form["allowed_users"]
		SaveAllowedUsers(int(last_id), PostData.AllowedUsers)
	}

	if ImageProvided {
		utils.SaveImage(file, PostData.Post_image)
	}

	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: last_id > 0,
		Message: "Post Created Successfully",
		Data: map[string]any{
			"post_id": last_id,
		},
	})
}
