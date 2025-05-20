package profile

import (
	"net/http"

	"socialNetwork/auth"
	db "socialNetwork/db/sqlite"
	"socialNetwork/user"
	"socialNetwork/utils"
)

// GetUserProfile gets the current user's profile
func GetUserProfile(w http.ResponseWriter, r *http.Request) {
	token := auth.GetToken(w, r)
	if token == "" {
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: "Please login to continue",
			Error:   "You are not Authorized.",
		})
		return
	}

	UserId, err := user.GetUserIDByToken(token)
	if err != nil {
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: "Please login to continue",
			Error:   "You are not Authorized.",
		})
		return
	}

	profile, err := getUserProfileData(UserId)
	if err != nil {
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Error fetching profile",
			Error:   err.Error(),
		})
		return
	}

	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "User profile retrieved successfully",
		Data: map[string]interface{}{
			"Data": profile,
		},
	})
}

// Helper function to get user profile data
func getUserProfileData(userId string) (*UserProfile, error) {
	profile := &UserProfile{UserID: userId}

	// Get basic user info
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

	// // Get posts
	// rows, err := db.DB.Query(`
	//     SELECT id, user_id, content, image, created_at,
	//            (SELECT COUNT(*) FROM post_likes WHERE post_id = posts.id) as likes_count
	//     FROM posts
	//     WHERE user_id = ?
	//     ORDER BY created_at DESC`, userId)
	// if err == nil {
	// 	defer rows.Close()
	// 	for rows.Next() {
	// 		var post Post
	// 		if err := rows.Scan(
	// 			&post.ID, &post.UserID, &post.Content,
	// 			&post.Image, &post.CreatedAt, &post.Likes,
	// 		); err == nil {
	// 			profile.Posts = append(profile.Posts, post)
	// 		}
	// 	}
	// }

	// Get followers and following counts
	db.DB.QueryRow("SELECT COUNT(*) FROM posts WHERE user_id = ?", userId).Scan(&profile.Posts)
	db.DB.QueryRow("SELECT COUNT(*) FROM followers WHERE followed_id = ?", userId).Scan(&profile.FollowerCount)
	db.DB.QueryRow("SELECT COUNT(*) FROM followers WHERE follower_id = ?", userId).Scan(&profile.FollowingCount)

	return profile, nil
}
