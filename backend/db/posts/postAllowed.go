package Posts_db

import (
	"fmt"
	db "socialNetwork/db/sqlite"
)

func Proccess_Allowed_Users(PostID int, AllowedUsers []string) {

	for _, user := range AllowedUsers {
		stmnt, err := db.DB.Prepare("INSERT INTO post_allowed (post_id, user_id) VALUES (?, ?)")
		if err != nil {
			// Log the error and continue with the next user
			fmt.Printf("Error preparing statement for user %s: %v\n", user, err)
			continue
		}
		defer stmnt.Close()

		_, err = stmnt.Exec(PostID, user)
		if err != nil {
			// Log the error and continue with the next user
			fmt.Printf("Error executing statement for user %s: %v\n", user, err)
			continue
		}
	}
	
}
