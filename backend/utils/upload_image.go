package utils

import (
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"

	"github.com/google/uuid"
)

func PrepareImage(r *http.Request, ImageName, ImagePath string) (string, multipart.File, error) {
	Log("INFO", "Starting avatar upload")

	var avatarFilename string

	file, handler, err := r.FormFile(ImageName)
	if err != nil {
		if err == http.ErrMissingFile {
			Log("INFO", "No avatar file uploaded")
			return "", file, nil
		}
		Log("ERROR", "Failed to retrieve avatar file: "+err.Error())
		return "", file, fmt.Errorf("Failed to retrieve avatar file")
	}
	defer file.Close()
	Log("INFO", "Avatar file retrieved: "+handler.Filename)

	if handler.Size > 1024*1024 {
		Log("WARNING", "Avatar file too large: "+fmt.Sprint(handler.Size))
		return "", file, fmt.Errorf("Avatar file too large. Max size is 1MB")
	}

	buffer := make([]byte, 512)
	_, err = file.Read(buffer)
	if err != nil {
		Log("ERROR", "Cannot read avatar file: "+err.Error())
		return "", file, fmt.Errorf("Cannot read file")
	}

	contentType := http.DetectContentType(buffer)
	Log("INFO", "Detected content type: "+contentType)

	allowedTypes := map[string]bool{
		"image/jpeg": true,
		"image/png":  true,
		"image/webp": true,
	}

	if !allowedTypes[contentType] {
		Log("WARNING", "Invalid image format: "+contentType)
		return "", file, fmt.Errorf("Invalid image format. Allowed types are jpeg, png, and webp.")
	}

	file.Seek(0, io.SeekStart)

	uploadPhotos := "../uploads/" + ImagePath
	if _, err := os.Stat(uploadPhotos); os.IsNotExist(err) {
		err := os.MkdirAll(uploadPhotos, os.ModePerm)
		if err != nil {
			Log("ERROR", "Failed to create directory: "+err.Error())
			return "", file, fmt.Errorf("Cannot create directory")
		}
		Log("INFO", "Created directory: profile_images")
	}

	avatarFilename = uuid.New().String() + filepath.Ext(handler.Filename) //sdafsdafk2323.jpg
	Log("INFO", "Generated avatar filename: "+avatarFilename)

	return "../uploads/" + ImagePath + "/" + avatarFilename, file, nil
}

func SaveImage(file multipart.File, path string) {

	dst, err := os.Create(filepath.Join(path))
	fmt.Println(path)
	if err != nil {
		Log("ERROR", "Failed to create image file: "+err.Error())
		return
	}
	defer dst.Close()

	io.Copy(dst, file)
	Log("INFO", "Avatar saved successfully")
}
