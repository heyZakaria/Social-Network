CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    notif_type ENUM('follow',  'invite', 'private_message', 'group_message') NOT NULL,
    target_type ENUM('user', 'private_message', 'group') NOT NULL, 
    target_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(user_id) ON DELETE CASCADE
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);




-- notif ----> target
--          |
-- follow ----> user
-- invite ----> group
-- private_message ----> private_chat 
-- group_message ----> group_chat


-- OPTIONAL
-- like ----> post
-- comment ----> post
-- 1h to start event ----> event
