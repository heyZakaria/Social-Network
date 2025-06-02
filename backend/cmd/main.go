package main

import (
	"log"
	"net/http"

	"socialNetwork/auth"
	db "socialNetwork/db/sqlite"
	Group "socialNetwork/groups"
	"socialNetwork/middleware"
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
	router.Handle("/api/groups/", http.StripPrefix("/api/groups", Group.GroupMux()))

	log.Fatal(http.ListenAndServe(":8080", middleware.CheckCORS(middleware.CheckUserExeting(router))))
}
