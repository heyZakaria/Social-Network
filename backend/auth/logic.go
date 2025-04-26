package auth

import (
	"database/sql"
	"regexp"
	"socialNetwork/backend/utils"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

func ValidateRegistrationInput(p Profile) bool {
	utils.Log("INFO", "Validating registration input")

	if len(p.FirstName) < 3 || len(p.FirstName) > 20 {
		utils.Log("WARNING", "Invalid first name length")
		return false
	}

	if len(p.LastName) < 3 || len(p.LastName) > 20 {
		utils.Log("WARNING", "Invalid last name length")
		return false
	}

	emailRegex := regexp.MustCompile(`^[^\s@]+@[^\s@]+\.[^\s@]+$`)
	if !emailRegex.MatchString(p.Email) {
		utils.Log("WARNING", "Invalid email format")
		return false
	}

	if len(p.Password) < 8 {
		utils.Log("WARNING", "Password too short")
		return false
	}
	if !regexp.MustCompile(`[a-z]`).MatchString(p.Password) {
		utils.Log("WARNING", "Password must include lowercase letter")
		return false
	}
	if !regexp.MustCompile(`[A-Z]`).MatchString(p.Password) {
		utils.Log("WARNING", "Password must include uppercase letter")
		return false
	}
	if !regexp.MustCompile(`[0-9]`).MatchString(p.Password) {
		utils.Log("WARNING", "Password must include digit")
		return false
	}

	if p.Birthday.After(time.Now().AddDate(-15, 0, 0)) || p.Birthday.Before(time.Now().AddDate(-120, 0, 0)) {
		utils.Log("WARNING", "Invalid birthday range")
		return false
	}

	if p.NickName != "" {
		if len(p.NickName) > 20 {
			utils.Log("WARNING", "Nickname too long")
			return false
		}
		if !regexp.MustCompile(`^[a-zA-Z0-9_]+$`).MatchString(p.NickName) {
			utils.Log("WARNING", "Invalid nickname characters")
			return false
		}
	}

	if len(p.Bio) > 200 {
		utils.Log("WARNING", "Bio too long")
		return false
	}

	utils.Log("INFO", "Registration input valid")
	return true
}

func HashPassword(password string) (string, error) {
	utils.Log("INFO", "Hashing password")
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		utils.Log("ERROR", "Password hashing failed: "+err.Error())
		return "", err
	}
	utils.Log("INFO", "Password hashed successfully")
	return string(hashedPassword), nil
}

func EmailExists(db *sql.DB, email string) bool {
	utils.Log("INFO", "Checking if email exists: "+email)
	var exists bool
	err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE email = ?)", email).Scan(&exists)
	if err != nil {
		utils.Log("ERROR", "Database query failed: "+err.Error())
	}
	return err == nil && exists
}

func SaveUserToDB(db *sql.DB, p Profile, hashedPassword string) (string, error) {
	userID := uuid.New().String()
	utils.Log("INFO", "Saving user to database with ID: "+userID)

	stmt, err := db.Prepare(`
		INSERT INTO users (id, first_name, last_name, email, password_hash, nickname, bio, avatar, birthday)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
	`)
	if err != nil {
		utils.Log("ERROR", "Prepare statement failed: "+err.Error())
		return "", err
	}

	_, err = stmt.Exec(
		userID,
		p.FirstName,
		p.LastName,
		p.Email,
		hashedPassword,
		p.NickName,
		p.Bio,
		p.Avatar,
		p.Birthday,
	)
	if err != nil {
		utils.Log("ERROR", "Failed to execute insert: "+err.Error())
		return "", err
	}

	utils.Log("INFO", "User saved successfully")
	return userID, nil
}
