package comments

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"socialNetwork/auth"
	user "socialNetwork/user"
	"socialNetwork/utils"
)

func (c *Comment) CommentSaver(w http.ResponseWriter, r *http.Request) {
	token := auth.GetToken(w, r)
	UserId, err := user.GetUserIDByToken(token)
	if err != nil {
		fmt.Println("eroooooooooooooooooooooooor comment")
		utils.Log("Error", err.Error())
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: err.Error(),
		})
		return
	}

	err = r.ParseMultipartForm(10 << 20)
	if err != nil {
		utils.Log("Error", "Failed to parse multipart form: "+err.Error())
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "Failed to parse form data",
		})
		return
	}

	content := r.FormValue("content")
	postID := r.FormValue("postId")

	var profile auth.Profile
	profile.UserID = UserId

	content = strings.TrimSpace(content)
	if content == "" || len(content) > 10000 {
		utils.Log("Error", "comment is empty or length of comment is more then 10000 ")
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "comment is empty or length of comment is more then 10000!! ",
		})
		return
	}

	postIDInt, err := strconv.Atoi(postID)
	if err != nil {
		utils.Log("Error", "Invalid post ID format")
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "Invalid post ID format",
		})
		return
	}

	file, fileHeader, err := r.FormFile("image")
	if err == nil {
		defer file.Close()
		fmt.Printf("Received image: %s, size: %d\n", fileHeader.Filename, fileHeader.Size)
	}

	c.PostID = postIDInt
	c.Content = content
	err = c.SaveComment(profile.UserID, c.PostID, c.Content)
	if err != nil {
		utils.Log("Error", "data it's given machi hiya hadik!!!")
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "data it's given machi hiya hadik!!!",
		})
		return
	}
	comment, err := c.Getcomments(c.PostID, 0)

	fmt.Println("comment  ===> ", comment)

	if err != nil {
		utils.Log("Error", "have problem ==> getting comments!!!!")
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "have problem ==> getting comments!!!!",
		})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(comment)
}
