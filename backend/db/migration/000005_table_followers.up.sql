CREATE TABLE IF NOT EXISTS followers (
    followed_id  TEXT NOT NULL,
    follower_id  TEXT NOT NULL,
    follower_status TEXT NOT NULL
        DEFAULT 'accepted'
        CHECK (follower_status IN ('accepted','pending','rejected')),
    created_at  TEXT DEFAULT CURRENT_TIMESTAMP,
    CHECK (followed_id <> follower_id),
    PRIMARY KEY (followed_id, follower_id),
    -- FOREIGN KEY (followed_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE
) WITHOUT ROWID;

CREATE INDEX IF NOT EXISTS idx_follower_id ON followers(follower_id);
