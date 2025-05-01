
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL CHECK(LENGTH(first_name) >= 3 AND LENGTH(first_name) <= 20),
    last_name TEXT NOT NULL CHECK(LENGTH(last_name) >= 3 AND LENGTH(last_name) <= 20),
    email TEXT UNIQUE NOT NULL CHECK(LENGTH(email) < 70),
    password_hash TEXT NOT NULL,
    nickname TEXT CHECK(LENGTH(nickname) <= 20),
    bio TEXT CHECK(LENGTH(bio) < 200),
    avatar TEXT,
    birthday DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);