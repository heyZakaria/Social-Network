package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"
	"socialNetwork/backend/auth"
	"socialNetwork/backend/middleware"
	"socialNetwork/backend/utils"

	_ "github.com/mattn/go-sqlite3"
)

func CreateDatabase() (*sql.DB, error) {
	db, err := sql.Open("sqlite3", "./database.db")
	if err != nil {
		log.Fatal(err)
	}

	defer db.Close()
	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}
	schema, err := os.ReadFile("./schema.sql")
	if err != nil {
		log.Fatal(err)
	}
	_, err = db.Exec(string(schema))
	if err != nil {
		log.Fatal(err)
	}
	return db, nil
}

func main() {

	err := utils.InitLogger()
	if err != nil {
		log.Fatal("Cannot initialize logger:", err)
	}
	defer utils.CloseLogger()

	utils.Log("INFO", "Starting HTTP server at http://localhost:8080 ...")

	mux := http.NewServeMux()
	CreateDatabase()
	mux.HandleFunc("/api/register", auth.HandleRegister)
	log.Fatal(http.ListenAndServe(":8080", middleware.CheckCORS(mux)))
}
