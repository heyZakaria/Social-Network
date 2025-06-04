CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    notif_type TEXT NOT NULL CHECK (notif_type IN ('follow', 'invite', 'private_message', 'group_message', "like")),
    target_type TEXT NOT NULL CHECK (target_type IN ('user', 'private_message', 'group', "like")),
    target_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(user_id) ON DELETE CASCADE
);