CREATE TABLE IF NOT EXISTS post_allowed (
    post_id INTEGER REFERENCES posts(id),
    user_id TEXT REFERENCES users(id),
    PRIMARY KEY (post_id, user_id)
);
-- post_id     |      user_id
-- 30                  10
-- X Cant be inserted cause dublicate
-- 30                  10 
-- 30                  11
-- 30                  1