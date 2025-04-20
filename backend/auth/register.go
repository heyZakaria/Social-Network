package auth

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func HandleRegister(w http.ResponseWriter, r *http.Request) {

	var p *Profile
	err := json.NewDecoder(r.Body).Decode(&p)
	if err != nil {
		fmt.Println("Error decoding JSON:", err)
		return
	}
	
	var msg WriteMessage
	msg.Success = "true"
	err = json.NewEncoder(w).Encode(msg)
	if err != nil {
		fmt.Println("Error decoding JSON:", err)
		return
	}

}
