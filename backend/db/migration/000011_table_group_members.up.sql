CREATE TABLE IF NOT EXISTS groupMember(
    id INTEGER PRIMARY KEY AUTOINCREMENT ,
    user_id TEXT NOT NULL REFERENCES users(id) UNIQUE,
    group_id INTEGER NOT NULL REFERENCES groups(id) ,
    memberState TEXT CHECK(memberState IN ("Admin", "Member" , "Pending"))  NOT NULL, 
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP
); 