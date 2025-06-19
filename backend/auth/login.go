package auth

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"

	db "socialNetwork/db/sqlite"
	shared "socialNetwork/shared_packages"
	"socialNetwork/utils"

	"golang.org/x/crypto/bcrypt"
)

func HandleLogin(w http.ResponseWriter, r *http.Request) {
	utils.Log("INFO", "Received login request")

	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.Log("ERROR", "Failed to parse login form: "+err.Error())
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Error:   "Invalid request format",
		})
		return
	}

	utils.Log("INFO", "Request body parsed successfully")
	if req.Email == "" || req.Password == "" {
		utils.Log("WARNING", "Login attempt with empty fields")
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Error:   "Email and password are required",
		})
		return
	}
	utils.Log("INFO", "Email and password fields validated")

	var userID, hashedPassword string
	err := db.DB.QueryRow("SELECT id, password_hash FROM users WHERE email = ?", strings.ToLower(req.Email)).Scan(&userID, &hashedPassword)
	if err != nil {
		if err == sql.ErrNoRows {
			utils.Log("WARNING", "Login attempt with unknown email: "+req.Email)
			utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
				Success: false,
				Error:   "Account not found",
			})
			return
		}
		utils.Log("ERROR", "DB error on login: "+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Error:   "Internal server error",
		})
		return
	}
	utils.Log("INFO", "User data retrieved from DB for email: "+req.Email)

	if bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(req.Password)) != nil {
		utils.Log("WARNING", "Invalid password for user: "+req.Email)
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Error:   "Invalid credentials",
		})
		return
	}
	utils.Log("INFO", "Password validated successfully")

	utils.Log("INFO", "Sending success with token for user: "+userID)
	if userID == "" {
		utils.Log("ERROR", "UserID is empty. Cannot send token.")
	} else {
		r.WithContext(shared.SetContext(r, userID))
		SendSuccessWithToken(w, r, userID)
	}
}
