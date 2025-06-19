CREATE TABLE IF NOT EXISTS groups (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL CHECK(LENGTH(title) > 10 AND LENGTH(title) <120),
    `description` TEXT NOT NULL  CHECK(LENGTH(`description`) > 30 AND LENGTH(`description`) <250),
    creator_id TEXT REFERENCES users(id),
    covername TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);