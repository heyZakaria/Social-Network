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
	var commentData CommentData
	var profile auth.Profile

	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&commentData)

	defer r.Body.Close()

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	c.Content = commentData.Comment
	c.PostID = commentData.PostID
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
	profile.UserID = UserId
	c.Content = strings.TrimSpace(c.Content)
	if c.Content == "" || len(c.Content) > 10000 {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	err = c.SaveComment(UserId, c.PostID, c.Content)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	comment, err := c.Getcomments(c.PostID, 0)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(comment)
}
