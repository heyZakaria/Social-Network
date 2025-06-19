package profile

const (
	queryFollowers = `
        SELECT users.id, users.first_name, users.last_name, users.avatar
        FROM followers
        JOIN users ON users.id = followers.follower_id
        WHERE followers.followed_id = ? AND followers.follower_status = 'accepted'
    `
	queryFollowing = `
        SELECT users.id, users.first_name, users.last_name, users.avatar
        FROM followers
        JOIN users ON users.id = followers.followed_id
        WHERE followers.follower_id = ? AND followers.follower_status = 'accepted'
    `

	queryPendingRequests = `
        SELECT users.id, users.first_name, users.last_name, users.avatar
        FROM followers
        JOIN users ON users.id = followers.follower_id
        WHERE followers.followed_id = ? AND followers.follower_status = 'pending'
    `
	querySuggestions = `
        SELECT id, first_name, last_name, avatar, nickname
        FROM users
        WHERE id != ? AND id NOT IN (
            SELECT followed_id FROM followers WHERE follower_id = ?
            UNION
            SELECT follower_id FROM followers WHERE followed_id = ?
        )
        LIMIT 20
    `
)
