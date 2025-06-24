package Shared_Profile

import db "socialNetwork/db/sqlite"

// Helper function to get user profile data
func GetUserProfileData(userId string) (*UserProfile, error) {
	profile := &UserProfile{UserID: userId}
	err := db.DB.QueryRow(`
        SELECT first_name, last_name, email, nickname, bio, avatar, 
               profile_status, birthday, created_at 
        FROM users 
        WHERE id = ?`, userId).Scan(
		&profile.FirstName, &profile.LastName, &profile.Email,
		&profile.NickName, &profile.Bio, &profile.Avatar,
		&profile.ProfileStatus, &profile.Birthday, &profile.CreatedAt)
	if err != nil {
		return nil, err
	}
	db.DB.QueryRow("SELECT COUNT(*) FROM posts WHERE user_id = ?", userId).Scan(&profile.PostsCount)
	db.DB.QueryRow("SELECT COUNT(*) FROM followers WHERE followed_id = ? AND follower_status = 'accepted'", userId).Scan(&profile.FollowerCount)
	db.DB.QueryRow("SELECT COUNT(*) FROM followers WHERE follower_id = ? AND follower_status = 'accepted'", userId).Scan(&profile.FollowingCount)

	return profile, nil
}
