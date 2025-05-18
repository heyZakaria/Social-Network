CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL CHECK(LENGTH(title) > 10 AND LENGTH(title) <100),
    event_description TEXT NOT NULL CHECK(LENGTH(event_description) > 50 AND LENGTH(event_description) <250),
    day_of_event TEXT NOT NULL,
    time_of_event TEXT NOT NULL, 
    event_location TEXT NOT NULL CHECK(LENGTH(event_location) > 10 AND LENGTH(event_location) <50),
   /* group_id INTEGER NOT NULL REFERENCES groups(id), */
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);