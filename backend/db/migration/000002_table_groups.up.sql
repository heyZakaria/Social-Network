CREATE TABLE IF NOT EXISTS groups (
    id INTEGER PRIMARY KEY,
    descriptio TEXT NOT NULL  CHECK(LENGTH(descriptio) > 150 AND LENGTH(descriptio) <300),
    title TEXT NOT NULL CHECK(LENGTH(title) > 10 AND LENGTH(title) <120),
    creator_id TEXT REFERENCES users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);