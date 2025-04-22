package auth

import (
	"errors"
	"mime/multipart"
	"regexp"
	"time"
)

func ValidateRegisterInput(firstName, lastName, email, password, birthdayStr, nickName, bio string, avatarHeader *multipart.FileHeader) error {
	if len(firstName) < 3 {
		return errors.New("First name must be at least 3 characters")
	}
	if len(firstName) > 20 {
		return errors.New("First name must be at most 20 characters")
	}

	if len(lastName) < 3 {
		return errors.New("Last name must be at least 3 characters")
	}
	if len(lastName) > 20 {
		return errors.New("Last name must be at most 20 characters")
	}

	emailRegex := regexp.MustCompile(`^[^\s@]+@[^\s@]+\.[^\s@]+$`)
	if !emailRegex.MatchString(email) {
		return errors.New("Invalid email format")
	}

	if len(password) < 8 {
		return errors.New("Password must be at least 8 characters")
	}
	if !regexp.MustCompile(`[a-z]`).MatchString(password) {
		return errors.New("Password must include a lowercase letter")
	}
	if !regexp.MustCompile(`[A-Z]`).MatchString(password) {
		return errors.New("Password must include an uppercase letter")
	}
	if !regexp.MustCompile(`[0-9]`).MatchString(password) {
		return errors.New("Password must include a number")
	}

	birthday, err := time.Parse("2006-01-02", birthdayStr)
	if err != nil {
		return errors.New("Invalid birthday format")
	}
	today := time.Now()
	age := today.Year() - birthday.Year()
	if today.YearDay() < birthday.YearDay() {
		age--
	}
	if age < 15 {
		return errors.New("You must be at least 15 years old")
	}

	if nickName != "" {
		if len(nickName) > 20 {
			return errors.New("Nickname must be at most 20 characters")
		}
		if !regexp.MustCompile(`^[a-zA-Z0-9_]+$`).MatchString(nickName) {
			return errors.New("Nickname can only include letters, numbers, and underscores")
		}
	}

	if len(bio) > 200 {
		return errors.New("Bio must be at most 200 characters")
	}

	if avatarHeader != nil {
		if avatarHeader.Size > 1*1024*1024 {
			return errors.New("Avatar must be less than 1MB")
		}
		contentType := avatarHeader.Header.Get("Content-Type")
		if contentType != "image/jpeg" && contentType != "image/png" && contentType != "image/webp" {
			return errors.New("Only image files are allowed (jpeg, png, webp)")
		}
	}

	return nil
}
