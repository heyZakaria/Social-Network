package chat

var (
	Insert_queries = map[string]string{
		"private_message": `INSERT INTO chats (session_id, sender_id, receiver_id,
							 message_content) VALUES (?, ?, ?, ?)`,

		"group_message": `INSERT INTO group_chat (session_id, sender_id, group_id,
							message_content) VALUES (?, ?, ?, ?)`,
	}
	Get_Recent_Chats = `
	SELECT
  c.*,
  u.id AS other_user_id,
  u.first_name,
  u.last_name,
  u.avatar
FROM chats c
JOIN (
    SELECT
      id
    FROM chats
    WHERE sender_id = ? OR receiver_id = ?
    GROUP BY
      CASE WHEN sender_id < receiver_id THEN sender_id ELSE receiver_id END,
      CASE WHEN sender_id > receiver_id THEN sender_id ELSE receiver_id END
    HAVING MAX(created_at || id) = created_at || id
) latest ON c.id = latest.id
JOIN users u ON u.id = 
  CASE 
    WHEN c.sender_id = ? THEN c.receiver_id
    ELSE c.sender_id
  END
ORDER BY c.created_at DESC;

	          `
	Get_Group_Chat_History = `
						SELECT 
						gc.id,
						gc.session_id,
						gc.sender_id,
						u.first_name,
						u.last_name,
						u.avatar,
						gc.group_id,
						gc.message_content,
						gc.created_at
					FROM group_chat gc
					JOIN users u ON gc.sender_id = u.id
					JOIN (
						SELECT group_id, MAX(created_at) AS max_created
						FROM group_chat
						GROUP BY group_id
					) AS latest_msg
					ON gc.group_id = latest_msg.group_id AND gc.created_at = latest_msg.max_created
					ORDER BY gc.created_at DESC;
					`
)
