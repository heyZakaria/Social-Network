CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL ,
    last_name TEXT NOT NULL ,
    email TEXT UNIQUE NOT NULL CHECK(LENGTH(email) < 70),
    password_hash TEXT NOT NULL,
    nickname TEXT CHECK(LENGTH(nickname) < 20),
    bio TEXT,
    avatar TEXT UNIQUE,
    birthday DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
