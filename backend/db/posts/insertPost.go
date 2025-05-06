package Posts_db

// type LocalPost PostStruct.Post

// func (p *LocalPost) InsertPost(d PostStruct.Post) (lastInsertId int64, err error) {
// 	statment, err := db.DB.Prepare("INSERT INTO posts (user_id, post, post_image, privacy) VALUES (?, ?, ?, ?)")
// 	if err != nil {
// 		// TODO Handel Error
// 	}
// 	defer statment.Close()

// 	result, err := statment.Exec(d.UserID, d.Post, d.Post_image, d.Privacy)
// 	if err != nil {
// 		// TODO Handel Error
// 	}
// 	lastInsertId, err = result.LastInsertId()
// 	if err != nil {
// 		// TODO Handel Error
// 	}
// 	return
// }
