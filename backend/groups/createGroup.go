package Group

import (
	"net/http"

	"socialNetwork/utils"
)

func createGroup(w http.ResponseWriter, r *http.Request) {
	utils.Log("INFO", "Received request for GroupCreation")
	r.ParseForm()
}
