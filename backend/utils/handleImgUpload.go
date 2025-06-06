package utils

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"

	"github.com/google/uuid"
)

func HandleUploadImage(r *http.Request, formFileName string, expectedSize int64, uploadDestination string) (string, error) {
	Log("INFO", fmt.Sprintf("Handling file upload for form field '%s'", formFileName))

	file, handler, err := r.FormFile(formFileName)
	if err != nil {
		if err == http.ErrMissingFile {
			Log("INFO", fmt.Sprintf("No file uploaded for field '%s'", formFileName))
			return "", nil
		}
		Log("ERROR", fmt.Sprintf("Error retrieving file '%s': %s", formFileName, err.Error()))
		return "", fmt.Errorf("failed to retrieve file '%s'", formFileName)
	}
	defer file.Close()

	Log("INFO", fmt.Sprintf("Received file: %s (%d bytes)", handler.Filename, handler.Size))

	if handler.Size > expectedSize {
		Log("WARNING", fmt.Sprintf("File too large for field '%s': %d bytes", formFileName, handler.Size))
		return "", fmt.Errorf("file too large (max size is %.2fMB)", float64(expectedSize)/1024.0/1024.0)
	}

	buffer := make([]byte, 512)
	if _, err := file.Read(buffer); err != nil {
		Log("ERROR", fmt.Sprintf("Failed to read file for MIME check: %s", err.Error()))
		return "", fmt.Errorf("could not read file for validation")
	}

	contentType := http.DetectContentType(buffer)
	Log("INFO", fmt.Sprintf("Detected content type: %s", contentType))

	allowedTypes := map[string]bool{
		"image/jpeg": true,
		"image/png":  true,
		"image/webp": true,
	}

	if !allowedTypes[contentType] {
		Log("WARNING", fmt.Sprintf("Rejected file '%s': unsupported type %s", handler.Filename, contentType))
		return "", fmt.Errorf("invalid image format. Allowed: jpeg, png, webp")
	}

	file.Seek(0, io.SeekStart)

	if _, err := os.Stat(uploadDestination); os.IsNotExist(err) {
		if err := os.MkdirAll(uploadDestination, os.ModePerm); err != nil {
			Log("ERROR", fmt.Sprintf("Failed to create directory '%s': %s", uploadDestination, err.Error()))
			return "", fmt.Errorf("could not create upload directory")
		}
		Log("INFO", fmt.Sprintf("Created upload directory: %s", uploadDestination))
	}

	filename := uuid.New().String() + filepath.Ext(handler.Filename)
	savePath := filepath.Join(uploadDestination, filename)

	dst, err := os.Create(savePath)
	if err != nil {
		Log("ERROR", fmt.Sprintf("Failed to create file at '%s': %s", savePath, err.Error()))
		return "", fmt.Errorf("could not save uploaded file")
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		Log("ERROR", fmt.Sprintf("Failed to write to file '%s': %s", savePath, err.Error()))
		return "", fmt.Errorf("error saving file")
	}

	Log("INFO", fmt.Sprintf("Successfully saved file as: %s", filename))
	return filename, nil
}
