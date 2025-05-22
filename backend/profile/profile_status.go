package profile

import (
	"encoding/json"
	"fmt"
	"net/http"

	"socialNetwork/auth"
	db "socialNetwork/db/sqlite"
	"socialNetwork/user"
	"socialNetwork/utils"
)


func ProfileStatus(w http.ResponseWriter, r *http.Request) {
	fmt.Println("==== UpdateProfileStatus CALLED ====")
	token := auth.GetToken(w, r)
	if token == "" {
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: "Please login to continue",
			Error:   "You are not Authorized.",
		})
		return
	}

	userID, err := user.GetUserIDByToken(token)
	if err != nil {
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: "Please login to continue",
			Error:   "You are not Authorized.",
		})
		return
	}

	var payload UserProfile
	err = json.NewDecoder(r.Body).Decode(&payload)
	if err != nil || (payload.ProfileStatus != "public" && payload.ProfileStatus != "private") {
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Message: "Invalid profile status",
		})
		return
	}

	_, err = db.DB.Exec(`UPDATE users SET profile_status = ? WHERE id = ?`, payload.ProfileStatus, userID)
	if err != nil {
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Failed to update profile status",
			Error:   err.Error(),
		})
		return
	}

	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "Profile status updated",
		Data: map[string]any{
			"profile_status": payload.ProfileStatus,
		},
	})
}
