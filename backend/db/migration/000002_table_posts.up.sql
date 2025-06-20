CREATE TABLE IF NOT EXISTS posts (
    id  INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    post_content TEXT NOT NULL,
    post_image TEXT DEFAULT '',
    post_privacy TEXT NOT NULL
        DEFAULT 'public'
        CHECK (post_privacy IN ('public', 'custom_users', 'followers')),
    -- in custome option, we are saving users ids and post id 
    -- on the post_allowed table
    group_id TEXT DEFAULT NULL ,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE 
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE 

);