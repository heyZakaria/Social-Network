CREATE TABLE IF NOT EXISTS posts (
    id  INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL REFERENCES users(id),
    post TEXT NOT NULL,
    post_image TEXT DEFAULT '',
    privacy TEXT NOT NULL DEFAULT 'public', -- public - followers - costume
    -- in custome option, we are saving users ids and post id 
    -- on the post_allowed table
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);