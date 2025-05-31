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

	router.Handle("/posts/", http.StripPrefix("/posts", post.PostMux()))
	router.Handle("/likes/", http.StripPrefix("/likes", likes.LikesMux()))
	router.Handle("/comment/", http.StripPrefix("/comment", comment.CommentMux()))

	// Profile routes
	router.HandleFunc("GET /api/users/profile", profile.GetUserProfile)
	// Profile routes
	router.HandleFunc("GET /api/users/friends", profile.GetFriendsAndRequests)
	router.HandleFunc("GET /api/users/profile", profile.GetUserProfile)
	router.HandleFunc("PUT /api/users/privacy", profile.ProfileStatus)
	router.HandleFunc("GET /api/users/get/profile", profile.GetOtherUserProfile)
	router.HandleFunc("GET /api/users/follow", profile.ToggleFollowUser)
	router.HandleFunc("POST /api/users/follow", profile.ToggleFollowUser)
	router.HandleFunc("POST /api/users/accept", profile.AcceptFollowRequest)
	router.HandleFunc("POST /api/users/reject", profile.RejectFollowRequest)
	//  router.HandleFunc("GET /api/users/suggestions", profile.GetUserSuggestions)

	log.Fatal(http.ListenAndServe(":8080", middleware.CheckCORS(middleware.CheckUserExeting(router))))
}
