package comments

import (
	"encoding/json"
	"net/http"
	"strings"

	"socialNetwork/auth"
	user "socialNetwork/user"
	"socialNetwork/utils"
)

func (c *Comment) CommentSaver(w http.ResponseWriter, r *http.Request) {
	token := auth.GetToken(w, r)
	UserId, err := user.GetUserIDByToken(token)
	if err != nil {
		utils.Log("Error", err.Error())
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: err.Error(),
		})
		return
	}

	var commentData CommentData
	var profile auth.Profile

	decoder := json.NewDecoder(r.Body)
	err = decoder.Decode(&commentData)

	defer r.Body.Close()

	if err != nil {
		utils.Log("Error", err.Error())
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: err.Error(),
		})
		return
	}
	c.Content = commentData.Comment
	c.PostID = commentData.PostID
	profile.UserID = UserId
	c.Content = strings.TrimSpace(c.Content)
	if c.Content == "" || len(c.Content) > 10000 {
		utils.Log("Error", "comment is empty or length of comment is more then 10000 ")
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "comment is empty or length of comment is more then 10000!! ",
		})
		return
	}
	err = c.SaveComment(UserId, c.PostID, c.Content)
	if err != nil {
		utils.Log("Error", "data it's given machi hiya hadik!!!")
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "data it's given machi hiya hadik!!!",
		})
		return
	}
	comment, err := c.Getcomments(c.PostID, 0)
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
