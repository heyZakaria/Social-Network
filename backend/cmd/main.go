package main

import (
	"log"
	"net/http"
	"path/filepath"
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
	router.Handle("/chat/", http.StripPrefix("/chat", auth.AuthMux()))
	router.Handle("/posts/", http.StripPrefix("/posts", post.PostMux()))
	router.Handle("/likes/", http.StripPrefix("/likes", likes.LikesMux()))

	router.HandleFunc("GET /api/verify", middleware.CheckUserExeting)

    // Profile routes
    router.HandleFunc("GET /api/users/profile", profile.GetUserProfile)
    router.HandleFunc("GET /api/users/get/profile", profile.GetOtherUserProfile)
    router.HandleFunc("POST /api/users/{id}/follow", profile.FollowUser)
    router.HandleFunc("POST /api/users/{id}/unfollow", profile.UnfollowUser)
	// Handler for /api/post

	// Testing serving images
	//http://localhost:8080/uploads/posts/40809c81-b8b6-45aa-8311-4abe9de995f8.JPEG
	router.HandleFunc("/uploads/", func(w http.ResponseWriter, r *http.Request) {
		// get Path and file name
		filename := filepath.Base(r.URL.Path)  // 40809c81-b8b6-45aa-8311-4abe9de995f8.JPEG
		PathFolder := filepath.Dir(r.URL.Path) // uploads/posts/

		//concat Paths
		fullPath := filepath.Join("../"+PathFolder, filename)
		// Serve the image to the user
		http.ServeFile(w, r, fullPath)
	})
	log.Fatal(http.ListenAndServe(":8080", middleware.CheckCORS(router)))

}
