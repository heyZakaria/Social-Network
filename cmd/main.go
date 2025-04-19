package main

import (
	"log"
	"net/http"
	"socialNetwork/backend/auth"
	"socialNetwork/backend/middleware"
)

func main() {

	mux := http.NewServeMux()

	mux.HandleFunc("/api/register", auth.HandleRegister)
	log.Println("Starting HTTP server at http://localhost:8080 ...")
	log.Fatal(http.ListenAndServe(":8080", middleware.CheckCORS(mux)))
}
