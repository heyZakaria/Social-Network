package profile

type Post struct {
	ID        string `json:"id"`
	UserID    string `json:"userId"`
	Content   string `json:"content"`
	Image     string `json:"image"`
	CreatedAt string `json:"created_at"`
	Likes     int    `json:"likes"`
}

type User struct {
	ID            string `json:"id"`
	FirstName     string `json:"firstName"`
	LastName      string `json:"lastName"`
	NickName      string `json:"nickname"`
	Avatar        string `json:"avatar"`
	ProfileStatus string `json:"profile_status"`
}

type UserProfile struct {
	UserID         string `json:"id"`
	FirstName      string `json:"firstName"`
	LastName       string `json:"lastName"`
	Email          string `json:"email"`
	NickName       string `json:"nickname"`
	Bio            string `json:"bio"`
	Avatar         string `json:"avatar"`
	ProfileStatus  string `json:"profile_status"`
	Birthday       string `json:"birthday"`
	CreatedAt      string `json:"created_at"`
	FollowerCount  int    `json:"followerCount"`
	FollowingCount int    `json:"followingCount"`
	PostsCount     int    `json:"postsCount"`
	Followers      []User `json:"followers"`
	Following      []User `json:"following"`
	Requests       []User `json:"requests"`
	IsOwnProfile   bool
	CanView        bool
	IsFollowing    bool
	RequestPending bool
}
