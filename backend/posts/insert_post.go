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
		if !GroupExist || !MemberExist {
			return -1, fmt.Errorf("Either group does not exist or user is not a member of the group")
		}
	}
	statment, err := db.DB.Prepare("INSERT INTO posts (user_id, post_content, post_image, post_privacy , group_id) VALUES (?, ?, ?, ? , ?)")
	if err != nil {

		return -1, fmt.Errorf("error preparing statement: %w", err)
	}
	defer statment.Close()

	result, err := statment.Exec(p.UserID, p.Post_Content, p.Post_image, p.Privacy, p.Group_id)
	if err != nil {

		return -1, fmt.Errorf("error executing statement: %w", err)
	}
	lastInsertId, err = result.LastInsertId()
	if err != nil {

		return -1, fmt.Errorf("error getting last insert ID: %w", err)
	}
	return
}
