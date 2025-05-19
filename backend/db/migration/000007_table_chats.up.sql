CREATE TABLE IF NOT EXISTS chats(
    chat_id INTEGER PRIMARY KEY, 
    sender_id TEXT NOT NULL, 
    receiver_id TEXT NOT NULL, 
    message_content TEXT NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(usera_id) ON DELETE CASCADE
) NO ROWID;