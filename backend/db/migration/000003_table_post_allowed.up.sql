CREATE TABLE IF NOT EXISTS post_allowed (
    post_id INTEGER REFERENCES posts(id),
    user_id TEXT REFERENCES users(id),
    PRIMARY KEY (post_id, user_id)
);