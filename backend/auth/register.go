package auth

import (
	"fmt"
	"net/http"

	db "socialNetwork/db/sqlite"
	"socialNetwork/utils"

	_ "github.com/mattn/go-sqlite3"
)

func HandleRegister(w http.ResponseWriter, r *http.Request) {
	err := r.ParseMultipartForm(10 << 20)
	if err != nil {
		utils.Log("ERROR", "Failed to parse form: "+err.Error())
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Error:   "Error parsing form",
		})
		return
	}
	utils.Log("INFO", "Parsed multipart form")
	p, err := ParseForm(r)
	if err != nil {
		utils.Log("ERROR", "Failed to parse form of register: "+err.Error())
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Error:   err.Error(),
		})
		return
	}
	utils.Log("INFO", "Form fields parsed")

	if EmailExists(db.DB, p.Email) {
		utils.Log("WARNING", "Tried to register with existing email: "+p.Email)
		utils.SendJSON(w, http.StatusConflict, utils.JSONResponse{
			Success: false,
			Error:   "Email already exists",
		})
		return
	}
	utils.Log("INFO", "Email is unique")
	// Moving the HandleUploadImage to utils making it more modular to use
	// Added : Parameters => FormfileName: the targer file name , Expected size , And Destination
	// Goal of change : making it reusable
	avatarFilename, err := utils.HandleUploadImage(r, "avatar", 1024*1024, "../../frontend/public/uploads/profile_images")
	if err != nil {

		utils.Log("ERROR", "Avatar upload failed: "+err.Error())
		SendJSON(w, http.StatusInternalServerError, JSONResponse{
			Success: false,
			Error:   "Avatar upload failed",
		})
		return
	}
	p.Avatar = avatarFilename
	utils.Log("INFO", "Avatar uploaded: "+avatarFilename)

	if !ValidateRegistrationInput(p) {
		utils.Log("WARNING", "Validation failed for user input")
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Error:   "Invalid input",
		})
		return
	}
	utils.Log("INFO", "User input validated")

	hashedPassword, err := HashPassword(p.Password)
	if err != nil {
		utils.Log("ERROR", "Password hashing failed: "+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Error:   "Password hashing failed",
		})
		return
	}
	utils.Log("INFO", "Password hashed")
	ImageProvided, ImagePath, file, err := utils.PrepareImage(r, "avatar", "profile_image")
	if err != nil {
		utils.Log("ERROR", "Avatar upload failed: "+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Error:   "Avatar upload failed",
		})
		return
	}

	p.Avatar = ImagePath

	userID, err := SaveUserToDB(db.DB, p, hashedPassword)
	if err != nil {
		utils.Log("ERROR", "Failed to save user to DB: "+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Error:   "Failed to register user",
		})
		return
	}
	utils.Log("INFO", fmt.Sprintf("User registered with ID: %s", userID))
	if ImageProvided {
		utils.Log("INFO", "Avatar uploaded: "+ImagePath)
		utils.SaveImage(file, ImagePath)
	}

	SendSuccessWithToken(w, r, userID)
	utils.Log("INFO", "Success Register")
}
