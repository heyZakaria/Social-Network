package post

import (
	"fmt"
	"net/http"
	Structs "socialNetwork/struct"
	"socialNetwork/utils"
)

// POST /post
// Form Value, Form file -> POST Form / multipart form
// Json => content Json

func CreatePost(w http.ResponseWriter, r *http.Request) {
	// TODO check the user Permission to create a Post
	var err error
	r.ParseMultipartForm(10 << 20)

	PostData := Structs.Post{}
	PostData.UserID = 1 // Get User ID From JWT Token
	PostData.Post = r.FormValue("post_content")
	PostData.Privacy = r.FormValue("post_privacy")
	PostData.Post_image, err = utils.HandleUploadImage(r, "post_image", "posts")
	if err != nil {
		fmt.Println("Handle  Form File error")
	}

	// err = json.NewDecoder(r.Body).Decode(&PostData)
	// if err != nil {
	// 	// TODO Handle Error Respond to The front
	// 	fmt.Println("error in Decoding Json", err)
	// }

	// Send suer Data to Database
	last_id, err := PostData.InsertPost()
	if err != nil {
		// TODO Handle The error
		fmt.Println("Error Inserting Post")
	}

	// Values needed from Front to create Post
	// user_id
	// post TEXT
	// privacy TYPE
	// TODO Succesfull MSG :D
	utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
		Success: last_id > 0,
	})
}
