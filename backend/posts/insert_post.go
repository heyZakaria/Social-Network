package post

import (
	"fmt"

	db "socialNetwork/db/sqlite"
	shared "socialNetwork/shared_packages"
)

// Post inserts a new post into the database and returns the last inserted ID.
func (p *Post) InsertPost() (lastInsertId int64, err error) {
	if p.Group_id != nil {
		GroupExist, MemberExist, Err := shared.ValidateGroup(db.DB, *p.Group_id, p.UserID)
		if Err != nil {
			return -1, Err
		}
		if !GroupExist ||  !MemberExist {
			return -1, fmt.Errorf("Either group does not exist or user is not a member of the group")
		}
	}
	statment, err := db.DB.Prepare("INSERT INTO posts (user_id, post_content, post_image, post_privacy , group_id) VALUES (?, ?, ?, ? , ?)")
	if err != nil {
		fmt.Println("error in Prepare Statment Json", err)
		return -1, fmt.Errorf("error preparing statement: %w", err)
	}
	defer statment.Close()
	fmt.Println("User id", p.UserID)
	fmt.Println("Post Content", p.Post_Content)
	fmt.Println("Post Image", p.Post_image)
	fmt.Println("Post Privacy", p.Privacy)
	fmt.Println("Group id", p.Group_id)
	fmt.Println("Inserting Post into Database")

	result, err := statment.Exec(p.UserID, p.Post_Content, p.Post_image, p.Privacy, p.Group_id)
	if err != nil {
		fmt.Println("error in Executing Statment ", err)
		return -1, fmt.Errorf("error executing statement: %w", err)
	}
	lastInsertId, err = result.LastInsertId()
	if err != nil {
		fmt.Println("error getting last insertID", err)
		return -1, fmt.Errorf("error getting last insert ID: %w", err)
	}
	return
}
