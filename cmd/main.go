package main

import (
	"log"
	"net/http"
	"socialNetwork/backend/auth"
	db "socialNetwork/backend/db/sqlite"
	"socialNetwork/backend/middleware"
	"socialNetwork/backend/utils"

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

	_, err = db.InitDB("../backend/db/sqlite/database.db")

	router.Handle("/api/", http.StripPrefix("/api", auth.AuthMux()))

	log.Fatal(http.ListenAndServe(":8080", middleware.CheckCORS(router)))

}
