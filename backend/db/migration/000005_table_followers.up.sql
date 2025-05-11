CREATE TABLE IF NOT EXISTS followers (
    followed_id TEXT NOT NULL, -- private - public
    follower_id TEXT NOT NULL,
    follower_status TEXT NOT NULL DEFAULT 'accepted', -- accepted - pending - declined
    FOREIGN KEY (followed_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (followed_id, follower_id)
);