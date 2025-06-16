package comments

import (
	"fmt"
	"net/http"
	"strconv"

	shared "socialNetwork/shared_packages"
	"socialNetwork/utils"
)

var RateLimit = map[string]utils.LimitInfo{}

func CommentSaver(w http.ResponseWriter, r *http.Request) {
	var Comment Comment

	// here to get userId
	UserId := r.Context().Value(shared.UserIDKey).(string)

	//
	r.ParseMultipartForm(10 << 20)

	// this part to handle img and to save it
	ImageProvided, commentImg, file, err := utils.PrepareImage(r, "comment_image", "comment")
	Comment.Comment_img = commentImg
	if err != nil {
		utils.Log("ERROR", "Error Trying to Prepare Image: "+commentImg)
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Error:   "Error While Preparing Image, Please try again later.",
			Message: "Error occured Please try again later. " + err.Error(),
		})
		return
	}

	// this part to get post id
	postId, err := strconv.Atoi(r.FormValue("postId"))
	if err != nil {
		fmt.Println("have problem to convert from string to int")
	}

	// this part to get content of comment and handle errors
	Comment.Content = r.FormValue("content")
	if (Comment.Content == "" || len(Comment.Content) > 10000) && commentImg == "" {
		utils.Log("Error", "comment is empty or length of comment is more then 10000 or doesn't have image !! ")
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "comment is empty or length of comment is more then 10000 or doesn't have image !! ",
			Error:   "Comment must be between 1 and 10000 characters",
		})
		return
	}

	// Check Rate Limit for the user
	shouldReturn := utils.CheckRateLimit(RateLimit, UserId, w)
	if shouldReturn {
		return
	}

	// here to save comment
	err = Comment.SaveComment(UserId, postId)
	if err != nil {
		utils.Log("Error", "have problem to save the comment data")
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "have problem to save the comment data",
			Error:   err.Error(),
		})
		return
	}

	// here to save comment in front
	if ImageProvided {
		utils.SaveImage(file, Comment.Comment_img)
	}

	// here to send response to frontend
	utils.Log("Success", "Comment saved successfully")
	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "Comment saved successfully",
		Data: map[string]interface{}{
			"Comment": Comment,
		},
	})
}
