package main

import (
	"database/sql"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"socialNetwork/backend/auth"
	"socialNetwork/backend/middleware"

	_ "github.com/mattn/go-sqlite3"
)

func TakeImage(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		return
	}

	r.ParseMultipartForm(10 << 20)
	file, handler, err := r.FormFile("h") 
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	os.MkdirAll("uploads", os.ModePerm)

	filePath := filepath.Join("uploads", handler.Filename)
	dst, _ := os.Create(filePath)
	defer dst.Close()
	io.Copy(dst, file)

}

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

	log.Println("Starting HTTP server at http://localhost:8080 ...")
	mux := http.NewServeMux()
	CreateDatabase()
	mux.HandleFunc("/upload", TakeImage)
	mux.HandleFunc("/api/register", auth.HandleRegister)
	log.Fatal(http.ListenAndServe(":8080", middleware.CheckCORS(mux)))
}
