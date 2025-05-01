package auth

import (
	"database/sql"
	"fmt"
	"net/http"
	"socialNetwork/backend/utils"

	_ "github.com/mattn/go-sqlite3"
)

func HandleRegister(w http.ResponseWriter, r *http.Request) {
	err := r.ParseMultipartForm(10 << 20)
	if err != nil {
		utils.Log("ERROR", "Failed to parse form: "+err.Error())
		http.Error(w, "Error parsing form", http.StatusBadRequest)
		return
	}
	utils.Log("INFO", "Parsed multipart form")
	// db := &db.MyDB{}
	// fmt.Println("----- Register DB", db.DB)
	db, err := sql.Open("sqlite3", "./database.db")
	if err != nil {
		utils.Log("ERROR", "Database connection error: "+err.Error())
		http.Error(w, "Database connection error", http.StatusInternalServerError)
		return
	}

	utils.Log("INFO", "Database opened successfully")
	//defer db.DB.Close()

	p, err := ParseForm(r)
	if err != nil {
		utils.Log("ERROR", "Failed to parse form fields: "+err.Error())
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	utils.Log("INFO", "Form fields parsed")

	if EmailExists(db, p.Email) {
		utils.Log("WARNING", "Tried to register with existing email: "+p.Email)
		http.Error(w, "Email already exists", http.StatusConflict)
		return
	}
	utils.Log("INFO", "Email is unique")

	avatarFilename, err := HandleUploadImage(r)
	if err != nil {
		utils.Log("ERROR", "Avatar upload failed: "+err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	p.Avatar = avatarFilename
	utils.Log("INFO", "Avatar uploaded: "+avatarFilename)

	if !ValidateRegistrationInput(p) {
		utils.Log("WARNING", "Validation failed for user input")
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}
	utils.Log("INFO", "User input validated")

	hashedPassword, err := HashPassword(p.Password)
	if err != nil {
		utils.Log("ERROR", "Password hashing failed: "+err.Error())
		http.Error(w, "Password hashing failed", http.StatusInternalServerError)
		return
	}
	utils.Log("INFO", "Password hashed")

	userID, err := SaveUserToDB(db, p, hashedPassword)
	if err != nil {
		utils.Log("ERROR", "Failed to save user to DB: "+err.Error())
		http.Error(w, "Failed to register user", http.StatusInternalServerError)
		return
	}
	utils.Log("INFO", fmt.Sprintf("User registered with ID: %d", userID))

	SendSuccessResponse(w, userID)
	utils.Log("INFO", "Success response sent to client")
}
