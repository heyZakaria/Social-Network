package post

import (
	"fmt"
	"net/http"
	"strings"

	shared "socialNetwork/shared_packages"
	"socialNetwork/utils"
)


var RateLimit = map[string]utils.LimitInfo{}

func CreatePost(w http.ResponseWriter, r *http.Request) {
	// Add comments for each part
	// of the code to explain what it does
	// Initialize a new Post object
	PostData := Post{}
	// Get the user ID from the request context
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
	// Parse the multipart form data with a maximum size of 10 MB
	// This allows us to handle file uploads (like images)
	r.ParseMultipartForm(10 << 20)

	// Prepare the image from the form data
	// This function handles the image upload and returns the image path
	// If no image is provided, set the Post_image to an empty string
	ImageProvided, postImage, file, err := utils.PrepareImage(r, "post_image", "posts")

	PostData.Post_image = postImage
	if err != nil {
		utils.Log("ERROR", "Error Trying to Prepare Image: "+postImage)
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Error:   err.Error(),
			Message: "Error occured Please try again later. " + err.Error(),
		})
		return
	}
	PostData.Post_Content = r.FormValue("post_content")
	PostData.Post_Content = strings.Trim(PostData.Post_Content, " ")
	// Check if the post content is empty or exceeds the maximum length
	if (PostData.Post_Content == "" && postImage == "") || len(PostData.Post_Content) > 10000 {
		utils.Log("ERROR", "Post Content is Empty")
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Error:   "Post content is required to create a post",
			Message: "Post content is required to create a post",
		})
		return
	}
	// Validate the post privacy setting
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
	// Insert the post data into the database
	// This function handles the database insertion and returns the last inserted ID
	utils.Log("INFO", "Inserting Post into Database")
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

	// If the post privacy is set to "custom_users", we need to handle allowed users
	if PostData.Privacy == "custom_users" {
		r.ParseForm()
		PostData.AllowedUsers = r.Form["allowed_users"]
		SaveAllowedUsers(int(last_id), PostData.AllowedUsers)
	}
	// If an image was provided, save it to the specified path
	if ImageProvided {
		utils.SaveImage(file, PostData.Post_image)
	}
	// Log the successful creation of the post
	utils.Log("INFO", fmt.Sprintf("Post created successfully with ID: %d", last_id))
	// Send a JSON response back to the client indicating success
	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: last_id > 0,
		Message: "Post Created Successfully",
		Data: map[string]any{
			"post_id": last_id,
		},
	})
}
