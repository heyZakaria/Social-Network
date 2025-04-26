package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"
	"socialNetwork/backend/auth"
	"socialNetwork/backend/middleware"

	_ "github.com/mattn/go-sqlite3"
)

// func TakeImage(w http.ResponseWriter, r *http.Request) {
// 	r.ParseMultipartForm(10 << 20)
// 	file, handler, err := r.FormFile("image")
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	defer file.Close()

// 	os.MkdirAll("uploads", os.ModePerm)

// 	filePath := filepath.Join("uploads", handler.Filename)
// 	dst, _ := os.Create(filePath)
// 	defer dst.Close()
// 	io.Copy(dst, file)

// }

func CreateDatabase() (*sql.DB, error) {
	db, err := sql.Open("sqlite3", "./bitLkhzin.db")
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
	router := http.NewServeMux()
	CreateDatabase()

	router.Handle("/api/", http.StripPrefix("/api", auth.AuthMux()))

	// router.HandleFunc("/upload", TakeImage)
	router.HandleFunc("POST /api/register", auth.HandleRegister)
	log.Fatal(http.ListenAndServe(":8080", middleware.CheckCORS(router)))
}
