package auth

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"socialNetwork/backend/utils"
	"time"

	"github.com/google/uuid"
)

func ParseForm(r *http.Request) (Profile, error) {
	var p Profile
	p.FirstName = r.FormValue("firstname")
	p.LastName = r.FormValue("lastname")
	p.Email = r.FormValue("email")
	p.Password = r.FormValue("password")
	p.NickName = r.FormValue("nickname")
	p.Bio = r.FormValue("bio")
	p.Birthday, _ = time.Parse("2006-01-02", r.FormValue("birthday"))

	utils.Log("INFO", "Form fields parsed successfully")
	return p, nil
}

func HandleUploadImage(r *http.Request) (string, error) {
	utils.Log("INFO", "Starting avatar upload")

	var avatarFilename string

	file, handler, err := r.FormFile("avatar")
	if err != nil {
		if err == http.ErrMissingFile {
			utils.Log("INFO", "No avatar file uploaded")
			return "", nil
		}
		utils.Log("ERROR", "Failed to retrieve avatar file: "+err.Error())
		return "", fmt.Errorf("Failed to retrieve avatar file")
	}
	defer file.Close()
	utils.Log("INFO", "Avatar file retrieved: "+handler.Filename)

	if handler.Size > 1024*1024 {
		utils.Log("WARNING", "Avatar file too large: "+fmt.Sprint(handler.Size))
		return "", fmt.Errorf("Avatar file too large. Max size is 1MB")
	}

	buffer := make([]byte, 512)
	_, err = file.Read(buffer)
	if err != nil {
		utils.Log("ERROR", "Cannot read avatar file: "+err.Error())
		return "", fmt.Errorf("Cannot read file")
	}

	contentType := http.DetectContentType(buffer)
	utils.Log("INFO", "Detected content type: "+contentType)

	allowedTypes := map[string]bool{
		"image/jpeg": true,
		"image/png":  true,
		"image/webp": true,
	}

	if !allowedTypes[contentType] {
		utils.Log("WARNING", "Invalid image format: "+contentType)
		return "", fmt.Errorf("Invalid image format. Allowed types are jpeg, png, and webp.")
	}

	file.Seek(0, io.SeekStart)

	if _, err := os.Stat("profile_images"); os.IsNotExist(err) {
		err := os.MkdirAll("profile_images", os.ModePerm)
		if err != nil {
			utils.Log("ERROR", "Failed to create directory: "+err.Error())
			return "", fmt.Errorf("Cannot create directory")
		}
		utils.Log("INFO", "Created directory: profile_images")
	}

	avatarFilename = uuid.New().String() + filepath.Ext(handler.Filename)
	utils.Log("INFO", "Generated avatar filename: "+avatarFilename)

	dst, err := os.Create(filepath.Join("profile_images", avatarFilename))
	if err != nil {
		utils.Log("ERROR", "Failed to create file: "+err.Error())
		return "", fmt.Errorf("Cannot save avatar: %v", err)
	}
	defer dst.Close()

	io.Copy(dst, file)
	utils.Log("INFO", "Avatar saved successfully")
	return avatarFilename, nil
}

func SendSuccessResponse(w http.ResponseWriter, userID string) {
	utils.Log("INFO", "Sending success response with user ID: "+userID)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"success": "true",
		"id":      userID,
	})
}
