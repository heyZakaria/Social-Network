package post

import (
	"net/http"
	Structs "socialNetwork/struct"
	user "socialNetwork/user"
	"socialNetwork/utils"
)

func CreatePost(w http.ResponseWriter, r *http.Request) {
	PostData := Structs.Post{}

	UserId, err := user.GetUserIDByToken(r)
	if err != nil {
		utils.Log("Error", err.Error())
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: err.Error(),
		})
		return
	}
	PostData.UserID = UserId
	utils.Log("", "Start Creating the Post")
	Privacy := map[string]bool{
		"public":       true,
		"custom_users": true,
		"followers":    true,
	}
	r.ParseMultipartForm(10 << 20)

	PostData.Post = r.FormValue("post_content")
	if PostData.Post == "" {
		utils.Log("ERROR", "Post Content is Empty")
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "Post content is required to create a post",
		})
		return
	}
	PostData.Privacy = r.FormValue("post_privacy")
	if !Privacy[PostData.Privacy] {
		utils.Log("ERROR", "Error On the Privacy Mode user selected : "+PostData.Privacy)
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "Please Check the privacy of your Post.",
		})
		return
	}

	ImageProvided, postImage, file, err := utils.PrepareImage(r, "post_image", "posts")
	PostData.Post_image = postImage
	if err != nil {
		utils.Log("ERROR", "Error Trying to Prepare Image: "+postImage)
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Error occured Please try again later.",
		})
		return
	}

	last_id, err := PostData.InsertPost()
	if err != nil {
		utils.Log("ERROR", "Error Trying to save post into db")
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Error Inserting Post, Try again later.",
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
	})
}
