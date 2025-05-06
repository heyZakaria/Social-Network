package Structs

import (
	"fmt"
	db "socialNetwork/db/sqlite"
)

// POST /posts
type Post struct {
	UserID     int
	Post       string
	Post_image string
	Privacy    string
}

func (p *Post) InsertPost() (lastInsertId int64, err error) {
	statment, err := db.DB.Prepare("INSERT INTO posts (user_id, post, post_image, privacy) VALUES (?, ?, ?, ?)")
	if err != nil {
		fmt.Println("error in Prepare Statment Json", err)
		// TODO Handel Error
	}
	defer statment.Close()

	result, err := statment.Exec(p.UserID, p.Post, p.Post_image, p.Privacy)
	if err != nil {
		fmt.Println("error in Executing Statment ", err)
		// TODO Handel Error
	}
	lastInsertId, err = result.LastInsertId()
	if err != nil {
		fmt.Println("error getting last insertID", err)
		// TODO Handel Error
	}
	return
}
