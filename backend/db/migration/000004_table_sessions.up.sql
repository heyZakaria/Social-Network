CREATE TABLE sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    token TEXT NOT NULL,
    expiration_time TIMESTAMP NOT NULL DEFAULT (DATETIME('now', '+24 hours')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);