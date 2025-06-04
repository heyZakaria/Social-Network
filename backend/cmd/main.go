package main

import (
	"log"
	"net/http"

	"socialNetwork/auth"
	db "socialNetwork/db/sqlite"
	"socialNetwork/middleware"
	"socialNetwork/realTime"
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

	_, err = db.InitDB("../backend/db/sqlite/database.db")

	router.HandleFunc("/ws", realTime.WSHandler)

	router.Handle("/api/", http.StripPrefix("/api", auth.AuthMux()))

	log.Fatal(http.ListenAndServe(":8080", middleware.CheckCORS(router)))
}
