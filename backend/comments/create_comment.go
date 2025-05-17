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
	commentData.Comment = strings.TrimSpace(commentData.Comment)
	if commentData.Comment == "" || len(commentData.Comment) > 10000 {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	err = c.SaveComment(UserId, commentData.PostID, commentData.Comment)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	comment, err := c.GetCommentByPost(commentData.PostID, 0)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(comment)
}
