package auth

import (
	"fmt"
	"net/http"

	db "socialNetwork/db/sqlite"
	user "socialNetwork/user"
	"socialNetwork/utils"
)

func GetAvatar(w http.ResponseWriter, r *http.Request) {
	Profile := Profile{}

	token := GetToken(w, r)
	UserID, err := user.GetUserIDByToken(token)
	if err != nil {
		utils.Log("ERROR", "Invalid Token in GetPost Handler: "+err.Error())
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: "Please login to continue",
			Error:   "You are not Authorized.",
		})
		return
	}
	prepare, err := db.DB.Prepare("SELECT FROM users WHERE id = ?")
	if err != nil {
		utils.Log("ERROR", "Error Preparing Statment in GetAvatar Handler"+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Something went wrong, Please try again later",
			Error:   "Unable to fetch the avatar",
		})
		return
	}
	defer prepare.Close()

	err = prepare.QueryRow(UserID).Scan(&Profile.Avatar)
	if err != nil {
		utils.Log("ERROR", "Error scanning Profile in GetAvatar Handler: "+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Something went wrong, Please try again later",
			Error:   "Unable to fetch the Avatar",
		})
		return
	}

	fmt.Println("avatar", Profile.Avatar)

	utils.Log("INFO", "Avatar fetched successfully in GetAvatar Handler")
	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Data: map[string]any{
			"Avatar": Profile.Avatar,
		},
	})
}
