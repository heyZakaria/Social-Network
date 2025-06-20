package post

import (
	"fmt"

	db "socialNetwork/db/sqlite"
)

func (p *Post) InsertPost() (lastInsertId int64, err error) {
	statment, err := db.DB.Prepare("INSERT INTO posts (user_id, post_content, post_image, post_privacy , group_id) VALUES (?, ?, ?, ? , ?)")
	if err != nil {
		fmt.Println("error in Prepare Statment Json", err)
		// TODO Handel Error
	}
	defer statment.Close()

	result, err := statment.Exec(p.UserID, p.Post_Content, p.Post_image, p.Privacy, p.Group_id)
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
