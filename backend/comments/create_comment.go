package comments

import (
	"encoding/json"
	"net/http"
	"strings"

	shared "socialNetwork/shared_packages"
	"socialNetwork/utils"
)

func CommentSaver(w http.ResponseWriter, r *http.Request) {
	UserId := r.Context().Value(shared.UserIDKey).(string)

	// fmt.Println("comment")

	var Comment Comment

	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&Comment)

	defer r.Body.Close()

	if err != nil {
		utils.Log("Error", "have problem to decode the comment data")
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "have problem to decode the comment data",
			Error:   err.Error(),
		})
		return
	}
	Comment.Content = strings.TrimSpace(Comment.Content)
	if Comment.Content == "" || len(Comment.Content) > 10000 {
		utils.Log("Error", "comment is empty or length of comment is more then 10000!! ")
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "comment is empty or length of comment is more then 10000!! ",
			Error:   "Comment must be between 1 and 10000 characters",
		})
		return
	}
	err = Comment.SaveComment(UserId)
	if err != nil {
		utils.Log("Error", "have problem to save the comment data")
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "have problem to save the comment data",
			Error:   err.Error(),
		})
		return
	}
	
	utils.Log("Success", "Comment saved successfully")
	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "Comment saved successfully",
		Data: map[string]interface{}{
			"Comment": Comment,
		},
	})
}
