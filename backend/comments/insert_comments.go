package comments

import (
	"database/sql"
	"fmt"
	"html"

	db "socialNetwork/db/sqlite"
	post "socialNetwork/posts"
	"socialNetwork/utils"

	"github.com/gofrs/uuid/v5"
)

func (c *Comment) SaveComment(userID string, postId int) error {
	// ganerate uuid for comment
	c.ID = uuid.Must(uuid.NewV4()).String()
	c.PostID = postId
	c.UserID = userID
	return c.InsertComment()
}

// this func for insert comment in data base
func (c *Comment) InsertComment() error {
	// prepare query to insert comment
	query := "INSERT INTO comments (id, user_id, post_id, comment_img, content) VALUES (?, ?, ?, ?, ?)"
	prp, prepareErr := db.DB.Prepare(query)
	if prepareErr != nil {
		return prepareErr
	}
	defer prp.Close()
	c.Content = html.EscapeString(c.Content)
	_, execErr := prp.Exec(
		&c.ID,
		&c.UserID,
		&c.PostID,
		&c.Comment_img,
		&c.Content,
	)
	if execErr != nil {
		return execErr
	}
	return nil
}

func (c *Comment) IsPostExist(postId int, UserID, GroupId string) error {
	var Post post.Post
	var ProfileStatus string

	var query string
	var row *sql.Row
	if GroupId != "" {
		query = "SELECT * FROM posts  WHERE group_id = ? AND id = ?"
		row = db.DB.QueryRow(query, GroupId, postId)
	} else {
		query = "SELECT * FROM posts  WHERE group_id IS NULL AND id = ?"
		row = db.DB.QueryRow(query, postId)
	}
	err := row.Scan(&Post.PostId, &Post.UserID, &Post.Post_Content, &Post.Post_image, &Post.Privacy, &Post.Group_id, &Post.CreatedAt)

	stmnt, err := db.DB.Prepare("SELECT profile_status FROM users WHERE id = ?")
	if err != nil {
		utils.Log("ERROR", "Error Preparing Statment When trying to get Profile info of the author in GetPostsScroll Handler"+err.Error())
		return fmt.Errorf("Error preparing statement: %v", err)

	}
	err = stmnt.QueryRow(Post.UserID).Scan(&ProfileStatus)
	if err != nil {
		utils.Log("ERROR", "Error QueryRow When trying to Execute the row of Profile info of the author in GetPostsScroll Handler"+err.Error())
		utils.Log("ERROR", "Post.UserID:"+Post.UserID)
		fmt.Println(Post)
		return fmt.Errorf("Error executing query: %v", err)
	}

	if ProfileStatus == "private" && UserID != Post.UserID {
		// Check if the User Id Has access to this post,
		var HasAccess bool
		err = db.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM followers WHERE followed_id = ? AND follower_id = ?)", Post.UserID, UserID).Scan(&HasAccess)
		if err != nil || !HasAccess {
			return fmt.Errorf("User does not have access to this post")
		}
	}

	if Post.Privacy == "custom_users" && Post.UserID != UserID {
		var found bool
		// Check if the User Id Has access to this post,
		err := db.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM post_allowed WHERE post_id = ? AND user_id = ?)", Post.PostId, UserID).Scan(&found)
		if err != nil || !found {
			return fmt.Errorf("User does not have access to this post")
		}
	} else if Post.Privacy == "followers" && Post.UserID != UserID {
		var follower_status string
		// Check if the User Id Has access to this post,
		stmnt, err := db.DB.Prepare("SELECT follower_status FROM followers WHERE followed_id = ? AND follower_id = ?")
		if err != nil {
			return fmt.Errorf("User does not have access to this post")
		}
		defer stmnt.Close()
		err = stmnt.QueryRow(Post.UserID, UserID).Scan(&follower_status)
		if err != nil || follower_status != "accepted" {
			return fmt.Errorf("User is not an accepted follower of the post author")
		}
	}

	return nil
}
