CREATE TABLE IF NOT EXISTS follow_relationships (
    id TEXT PRIMARY KEY,
    follower_id TEXT NOT NULL,
    followed_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'rejected')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (followed_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(follower_id, followed_id)
);

CREATE INDEX idx_follow_relationships_follower ON follow_relationships(follower_id);
CREATE INDEX idx_follow_relationships_followed ON follow_relationships(followed_id);
CREATE INDEX idx_follow_relationships_status ON follow_relationships(status); 