package uploads

import (
	"log"
	"mime"
	"net/http"
	"os"
	"path/filepath"
	"socialNetwork/utils"
	"strings"
	"time"
)

// absolute location of your uploads directory on disk.
// keep it outside web-root if possible (e.g. "../data/uploads")
const uploadRoot = "images"

// ServeUpload handles requests like  GET /uploads/posts/abc.jpg
func ServeUpload(w http.ResponseWriter, r *http.Request) {
	utils.Log("", "ServeUpload called with path: "+r.URL.Path)

	// Trim the leading “/”, strip the first path element (images)
	relPath := strings.TrimPrefix(r.URL.Path, "/")
	utils.Log("", "Trimmed leading '/': "+relPath)
	relPath = strings.TrimPrefix(relPath, "api/images/")
	utils.Log("", "Removed 'api/images/': "+relPath)
	if relPath == "" {
		utils.Log("", "relPath is empty, returning 404")
		http.NotFound(w, r)
		return
	}

	// Clean path & prevent “../” traversal.
	clean := filepath.Clean(relPath)
	utils.Log("", "Cleaned path: "+clean)
	if strings.Contains(clean, "..") {
		utils.Log("", "Path contains '..', returning 400")
		http.Error(w, "invalid path", http.StatusBadRequest)
		return
	}

	// Build absolute path and verify it is still inside uploadRoot.
	full := filepath.Join(uploadRoot, clean)
	utils.Log("", "Full path: "+full)
	if !strings.HasPrefix(filepath.Clean(full), filepath.Clean(uploadRoot)) {
		utils.Log("", "Full path is outside uploadRoot, returning 403")
		http.Error(w, "forbidden", http.StatusForbidden)
		return
	}

	// Open the file
	if os.Getenv("ENV") != "docker" {
		full = "../" + full
	}
	file, err := os.Open(full)
	if err != nil {
		if os.IsNotExist(err) {
			utils.Log("", "File does not exist: "+full)
			http.NotFound(w, r)
		} else {
			utils.Log("", "Error opening file: "+err.Error())
			http.Error(w, "internal error", http.StatusInternalServerError)
			log.Print(err)
		}
		return
	}
	defer file.Close()
	utils.Log("", "File opened successfully: "+file.Name())

	// Detect & set content-type (ServeContent doesn’t sniff when Name has extension)
	if ctype := mime.TypeByExtension(filepath.Ext(full)); ctype != "" {
		utils.Log("", "Detected content-type: "+ctype)
		w.Header().Set("Content-Type", ctype)
	}

	// Optional: Cache for an hour
	w.Header().Set("Cache-Control", "public, max-age=3600")
	utils.Log("", "Set Cache-Control header")

	// Stream the file
	utils.Log("", "Streaming file: "+file.Name())
	http.ServeContent(w, r, file.Name(), fileStatModTime(file), file)
}

// fileStatModTime reports the mod-time but tolerates failure.
func fileStatModTime(f *os.File) (t time.Time) {
	if fi, err := f.Stat(); err == nil {
		return fi.ModTime()
	}
	return
}
