CREATE TABLE IF NOT EXISTS chats(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    sender_id TEXT NOT NULL, 
    receiver_id TEXT NOT NULL, 
    message_content TEXT NOT NULL,
    message_readed INTEGER NOT NULL DEFAULT 0,
    message_type TEXT NOT NULL CHECK (message_type IN ('private_message', 'group_message', 'notification', 'event')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);