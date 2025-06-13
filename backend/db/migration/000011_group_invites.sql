CREATE TABLE IF NOT EXISTS group_invite (
id INTEGER PRIMARY KEY AUTOINCREMENT,
sender_id TEXT NOT NULL,
reciever_id TEXT NOT NULL,
Joinstate TEXT NOT NULL CHECK( Joinstate IN ('Rejected' , 'Pending' , 'Accepted')),
Group_id INTEGER,
 FOREIGN KEY (sender_id) REFERENCES users(id)  ON DELETE CASCADE,
FOREIGN KEY (reciever_id) REFERENCES users(id) ON DELETE CASCADE,
) 