package comments

import (
	"encoding/json"
	"net/http"
	"socialNetwork/auth"
	shared "socialNetwork/context"
	"socialNetwork/utils"
	"strings"
)

func (c *Comment) CommentSaver(w http.ResponseWriter, r *http.Request) {
	/* 	token := auth.GetToken(w, r)
	   	UserId, err := user.GetUserIDByToken(token)
	   	if err != nil {
	   		utils.Log("ERROR", err.Error())
	   		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
	   			Success: false,
	   			Message: err.Error(),
	   		})
	   		return
	   	} */
	UserId := r.Context().Value(shared.UserIDKey).(string)
	var commentData CommentData
	var profile auth.Profile

	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&commentData)

	defer r.Body.Close()

	if err != nil {
		utils.Log("ERROR", err.Error())
		//////////////////////////// isn't Bad Request!!!
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
		utils.Log("ERROR", "comment is empty or length of comment is more then 10000 ")
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "comment is empty or length of comment is more then 10000!! ",
		})
		return
	}
	err = c.SaveComment(UserId, c.PostID, c.Content)
	if err != nil {
		utils.Log("ERROR", "data it's given machi hiya hadik!!!")
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "data it's given machi hiya hadik!!!",
		})
		return
	}
	comment, err := c.Getcomments(c.PostID, 0)
	if err != nil {
		utils.Log("ERROR", "have problem ==> getting comments!!!!")
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "have problem ==> getting comments!!!!",
		})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(comment)
}
