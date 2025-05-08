package Posts_db

import (
	db "socialNetwork/db/sqlite"
	"socialNetwork/utils"
)

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
