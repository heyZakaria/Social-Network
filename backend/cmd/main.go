package main

import (
	"log"
	"net/http"

	"socialNetwork/auth"
	"socialNetwork/db"
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

	server := http.NewServeMux()
	err = db.CreateDatabase()
	if err != nil {
		log.Fatal("Failed to create database: ", err)
	}
	defer db.DB.Close()

	server.HandleFunc("POST /api/register", auth.HandleRegister)
	server.HandleFunc("POST /api/login", auth.HandleLogin)
	log.Fatal(http.ListenAndServe(":8080", middleware.CheckCORS(server)))
}
