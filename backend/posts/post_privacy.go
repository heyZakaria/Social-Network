package post

import (
	db "socialNetwork/db/sqlite"
	"socialNetwork/utils"
)

// this function is used to save the allowed users for a post
// it takes the post id and the allowed users as input
// and saves them in the post_allowed table in the database
// it will insert the post id and the user id into the post_allowed table
// if the user id is already present in the table, it will not insert it again
// it will log the error if any occurs while inserting the data
func SaveAllowedUsers(PostID int, AllowedUsers []string) {
	for _, user := range AllowedUsers {
		stmnt, err := db.DB.Prepare("INSERT INTO post_allowed (post_id, user_id) VALUES (?, ?)")
		if err != nil {
			utils.Log("ERROR", "Error preparing statement for user :"+user+err.Error())
			continue
		}
		defer stmnt.Close()

		_, err = stmnt.Exec(PostID, user)
		if err != nil {
			// Log the error and continue with the next user
			utils.Log("ERROR", "Error executing statement for user :"+user+err.Error())
			continue
		}
	}
}
