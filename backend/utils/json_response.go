package utils

import (
	"encoding/json"
	"net/http"
)

type JSONResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message,omitempty"`
	Error   string `json:"error,omitempty"`
	Token   string `json:"token,omitempty"`
	Data    any    `json:"data,omitempty"`
}

func SendJSON(w http.ResponseWriter, status int, payload JSONResponse) {
	w.Header().Set("Content-Type", "application/json")

	if w.Header().Get("X-Status-Written") == "" {
		w.Header().Set("X-Status-Written", "yes")
		w.WriteHeader(status)
	}

	json.NewEncoder(w).Encode(payload)
}
