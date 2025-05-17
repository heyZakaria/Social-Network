package middleware

import (
	"fmt"
	"net/http"
	"socialNetwork/auth"
	db "socialNetwork/db/sqlite"
	user "socialNetwork/user"
	"socialNetwork/utils"
)

// Handler /verify
func CheckUserExeting(w http.ResponseWriter, r *http.Request) {
	token, err := auth.GetToken(w, r)
	if err != nil {
		utils.Log("ERROR", "Error getting token in CheckUserExeting Handler: "+err.Error())
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: "Please login to continue",
			Error:   "You are not Authorized.",
		})
		return
	}

	if token == "" {
		utils.Log("ERROR", "Invalid Token in CheckUserExeting Handler")
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: "Please login to continue",
			Error:   "You are not Authorized.",
		})
		return
	}
	fmt.Println("Token: ", token)
	UserID, err := user.GetUserIDByToken(token)
	fmt.Println("UserID: ", UserID)
	if err != nil || UserID == "" {
		utils.Log("ERROR", "Invalid Token in CheckUserExeting Handler: "+err.Error())
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: "Please login to continue",
			Error:   "You are not Authorized.",
		})
		return
	}

	profile := auth.Profile{}
	stmnt, err := db.DB.Prepare("SELECT first_name, last_name, email, nickname, bio, avatar, profile_status, birthday, created_at FROM users WHERE id = ?")
	if err != nil {
		utils.Log("ERROR", "Error preparing statement in CheckUserExeting Handler: "+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Internal Server Error",
			Error:   "Error preparing statement",
		})
		return
	}
	defer stmnt.Close()
	profile.UserID = UserID
	err = stmnt.QueryRow(UserID).Scan(&profile.FirstName, &profile.LastName, &profile.Email, &profile.NickName, &profile.Bio, &profile.Avatar, &profile.Profile_Status, &profile.Birthday, &profile.CreatedAt)
	if err != nil {
		utils.Log("ERROR", "Error executing query in CheckUserExeting Handler: "+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Internal Server Error",
			Error:   "Error executing query",
		})
		return
	}

	utils.Log("INFO", "User is logged in with ID: "+UserID)

	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "User is logged in",
		Error:   "",
		Data: map[string]any{
			"Data": profile,
		},
	})
}
