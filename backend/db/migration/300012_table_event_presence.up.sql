CREATE TABLE IF NOT EXISTS event_presence (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    `status` TEXT NOT NULL
        DEFAULT 'not going'
        CHECK (`status` IN ('not going', 'going')),
    group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);