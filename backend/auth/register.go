package auth

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/google/uuid"
	_ "github.com/mattn/go-sqlite3"
	"golang.org/x/crypto/bcrypt"
)

func HandleRegister(w http.ResponseWriter, r *http.Request) {
	err := r.ParseMultipartForm(10 << 20)
	if err != nil {
		http.Error(w, "Failed to parse form", http.StatusBadRequest)
		return
	}

	var avatarFilename string
	file, handler, err := r.FormFile("avatar")
	if err == nil {
		defer file.Close()
		os.MkdirAll("uploads", os.ModePerm)
		avatarFilename = uuid.New().String() + filepath.Ext(handler.Filename)
		dst, err := os.Create(filepath.Join("uploads", avatarFilename))
		if err != nil {
			http.Error(w, "Cannot save avatar", http.StatusInternalServerError)
			return
		}
		defer dst.Close()
		io.Copy(dst, file)
	}

	p := Profile{}
	p.FirstName = r.FormValue("firstname")
	p.LastName = r.FormValue("lastname")
	p.Email = r.FormValue("email")
	p.Password = r.FormValue("password")
	p.NickName = r.FormValue("nickname")
	p.Bio = r.FormValue("bio")
	p.Avatar = avatarFilename

	birthdayStr := r.FormValue("birthday")
	p.Birthday, err = time.Parse("2006-01-02", birthdayStr)
	if err != nil {
		http.Error(w, "Invalid birthday format", http.StatusBadRequest)
		return
	}

	err = ValidateRegisterInput(p.FirstName, p.LastName, p.Email, p.Password, birthdayStr, p.NickName, p.Bio, handler)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	userID := uuid.New().String()
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(p.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Password hashing failed", http.StatusInternalServerError)
		return
	}

	db, err := sql.Open("sqlite3", "./database.db")
	if err != nil {
		http.Error(w, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	var exists bool
	err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE email = ?)", p.Email).Scan(&exists)
	if err != nil {
		http.Error(w, "Failed to check email", http.StatusInternalServerError)
		return
	}
	if exists {
		http.Error(w, "Email already exists", http.StatusConflict)
		return
	}

	stmt, err := db.Prepare(`
    INSERT INTO users (id, first_name, last_name, email, password_hash, nickname, bio, avatar, birthday)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`)

	if err != nil {
		fmt.Println("Database prepare failed:", err)
		http.Error(w, "Database prepare failed", http.StatusInternalServerError)
		return
	}

	_, err = stmt.Exec(
		userID,
		p.FirstName,
		p.LastName,
		p.Email,
		string(hashedPassword),
		p.NickName,
		p.Bio,
		p.Avatar,
		p.Birthday,
	)
	if err != nil {
		fmt.Printf("Insert error: %+v\n", err)
		http.Error(w, "Insert failed", http.StatusInternalServerError)
		return
	}

	fmt.Println("User inserted successfully")

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"success": "true",
		"id":      userID,
	})

}
