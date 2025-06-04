package profile

import (
	"fmt"

	db "socialNetwork/db/sqlite"
	"socialNetwork/utils"
)

func LoadUsers(userID string, status string) ([]User, error) {
	rows, err := db.DB.Query(`
		SELECT users.id, users.first_name, users.last_name, users.avatar
		FROM followers
		JOIN users ON users.id = followers.follower_id
		WHERE followers.followed_id = ? AND followers.follower_status = ?
	`, userID, status)
	if err != nil {
		utils.Log("ERROR", "Failed to load followers: "+err.Error())
		return nil, err
	}
	defer rows.Close()

	var followers []User
	for rows.Next() {
		var follower User
		if err := rows.Scan(&follower.ID, &follower.FirstName, &follower.LastName, &follower.Avatar); err != nil {
			utils.Log("ERROR", "Error scanning follower: "+err.Error())
			continue
		}
		followers = append(followers, follower)
	}
	utils.Log("INFO", fmt.Sprintf("Loaded %d followers with status '%s'", len(followers), status))
	return followers, nil
}

func GetFollowing(userID string) ([]User, error) {
	rows, err := db.DB.Query(`
		SELECT users.id, users.first_name, users.last_name, users.avatar
		FROM followers
		JOIN users ON users.id = followers.followed_id
		WHERE followers.follower_id = ? AND followers.follower_status = 'accepted'
	`, userID)
	if err != nil {
		utils.Log("ERROR", "Failed to load following: "+err.Error())
		return nil, err
	}
	defer rows.Close()

	var following []User
	for rows.Next() {
		var follow User
		if err := rows.Scan(&follow.ID, &follow.FirstName, &follow.LastName, &follow.Avatar); err != nil {
			utils.Log("ERROR", "Error scanning following: "+err.Error())
			continue
		}
		following = append(following, follow)
	}
	utils.Log("INFO", fmt.Sprintf("Loaded %d following", len(following)))
	return following, nil
}
