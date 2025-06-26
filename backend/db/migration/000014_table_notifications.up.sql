CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  type_notification TEXT NOT NULL,
  content TEXT,
  invite_id INTEGER NOT NULL DEFAULT 0,
  event_id INTEGER,
  group_id TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, sender_id, type_notification, content, event_id, group_id, invite_id)
);
