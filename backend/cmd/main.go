package main

import (
	"log"
	"net/http"

	comment "socialNetwork/comments"

	"socialNetwork/auth"
	db "socialNetwork/db/sqlite"
	"socialNetwork/likes"
	"socialNetwork/middleware"
	post "socialNetwork/posts"
	"socialNetwork/profile"
	"socialNetwork/utils"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	err := utils.InitLogger()
	if err != nil {
		log.Fatal("Cannot initialize logger:", err)
	}
	defer utils.CloseLogger()

	utils.Log("INFO", "Starting HTTP server at http://localhost:8080 ...")

	router := http.NewServeMux()

	_, err = db.InitDB("../db/sqlite/database.db")

	router.Handle("/api/", http.StripPrefix("/api", auth.AuthMux()))

	router.Handle("/api/posts/", http.StripPrefix("/api/posts", post.PostMux()))
	router.Handle("/api/likes/", http.StripPrefix("/api/likes", likes.LikesMux()))
	router.Handle("/api/comment/", http.StripPrefix("/api/comment", comment.CommentMux()))

	router.Handle("/api/users/", http.StripPrefix("/api/users", profile.ProfileMux()))

	log.Fatal(http.ListenAndServe(":8080", middleware.CheckCORS(middleware.CheckUserExeting(router))))
}
