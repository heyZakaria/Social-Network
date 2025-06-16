package realTime

import (
	"fmt"
	db "socialNetwork/db/sqlite"
	"socialNetwork/utils"
	"sync"
)

var clients = make(map[string]*Client)

// var broadcast = make(chan MessageStruct)
var mutex = &sync.Mutex{}

func ReadMessages(UserID string) {
	client, ok := clients[UserID]
	if !ok || client == nil || client.Conn == nil {
		utils.Log("ERROR", "Client not found or connection is nil for UserID: "+UserID)
		return
	}
	var msgs MessageResponse
	var err error

	for {
		err = client.Conn.ReadJSON(&msgs.Single)
		if err != nil {
			utils.Log("ERROR", "Error reading JSON: "+err.Error())
			fmt.Println("UserID:", UserID, "Error reading JSON:", err.Error())
			fmt.Println("Map Length:")
			client.Conn.Close()
			mutex.Lock()
			delete(clients, UserID)
			mutex.Unlock()
			break
		}

		if msgs.Single.Type == "" || msgs.Single.Receiver == "" || msgs.Single.Content == "" {
			utils.Log("ERROR", "Message or Receiver type or Content is empty")
			continue
		}

		utils.Log("INFO", "Message received: "+msgs.Single.Content)

		if (msgs.Single.Type == "private_message" || msgs.Single.Type == "fetch_messages") && (msgs.Single.Receiver != UserID) {
			db.DB.QueryRow(`SELECT chat_session_id FROM chats WHERE sender_id = ? AND receiver_id = ?
			OR receiver_id = ? AND sender_id = ? LIMIT 1`, UserID, msgs.Single.Receiver, UserID, msgs.Single.Receiver).Scan(&msgs.SessionID)
			// If yes, use the existing chat session ID
			if msgs.SessionID == "" {
				msgs.Single.FirstTime = true
				utils.Log("INFO", "No existing chat session found, creating a new one")
				msgs.Single.SessionID = utils.GenerateChatSessionID(UserID, msgs.Single.Receiver)
				utils.Log("INFO", "New chat session ID created: "+msgs.Single.SessionID)
			}
			stmnt, err := db.DB.Prepare("INSERT INTO chats (session_id, sender_id, receiver_id, message_content, message_type) VALUES (?, ?, ?, ?, ?)")
			fmt.Println("Whole MSG :", msgs)
			if err != nil {
				utils.Log("ERROR", "Error preparing statement: "+err.Error())
				continue
			}
			defer stmnt.Close()
			_, err = stmnt.Exec(msgs.Single.SessionID, UserID, msgs.Single.Receiver, msgs.Single.Content, msgs.Single.Type)
			if err != nil {
				utils.Log("ERROR", "Error inserting message into database: "+err.Error())
				continue
			}
		} else if msgs.Single.Type == "fetch_messages" {
			var message MessageStruct
			db.DB.QueryRow(`SELECT chat_session_id FROM chats WHERE sender_id = ? AND receiver_id = ?
			OR receiver_id = ? AND sender_id = ? LIMIT 1`, UserID, msgs.Single.Receiver, UserID, msgs.Single.Receiver).Scan(&msgs.Single.SessionID)
			// If yes, use the existing chat session ID
			if msgs.Single.SessionID == "" {
				msgs.Single.FirstTime = true
				utils.Log("INFO", "No existing chat session found, creating a new one")
				msgs.Single.SessionID = utils.GenerateChatSessionID(UserID, msgs.Single.Receiver)
				utils.Log("INFO", "New chat session ID created: "+msgs.Single.SessionID)
			}
			fmt.Println("Fetching messages for session ID:", msgs.Single.SessionID)
			rows, err := db.DB.Query("SELECT sender_id, receiver_id, message_content, message_type FROM chats WHERE session_id = ?", msgs.SessionID)
			if err != nil {
				utils.Log("ERROR", "Error fetching messages from database: "+err.Error())
				continue
			}
			defer rows.Close()
			for rows.Next() {
				err = rows.Scan(&message.Sender, &message.Receiver, &message.Content, &message.Type)
				if err != nil {
					utils.Log("ERROR", "Error scanning row: "+err.Error())
					continue
				}
			}
			MessageRespond = append(MessageRespond, message)
		}
		mutex.Lock()
		client, ok = clients[UserID]
		mutex.Unlock()
		if ok {
			client.Broadcast <- ResponseMessage
		}
	}
}

func WriteMessages(UserID string) {
	for {
		// Grab the next message from the broadcast channel
		message := <-clients[UserID].Broadcast

		mutex.Lock()
		var err error
		client, ok := clients[message.Receiver]
		if !ok || client == nil || client.Conn == nil {
			utils.Log("ERROR", "Client not found or connection is nil for Receiver: "+message.Receiver)
			mutex.Unlock()
			continue
		}
		if message.Type == "private_message" {
			err = clients[message.Receiver].Conn.WriteJSON(message)
			if err != nil {
				utils.Log("ERROR", "Error sending message to Receiver: "+message.Receiver)
				clients[message.Receiver].Conn.Close()
				delete(clients, message.Receiver)
			}
			utils.Log("INFO", fmt.Sprintf("Message sent to %s: %s", message.Receiver, message.Content))
			err = clients[UserID].Conn.WriteJSON(message)
			if err != nil {
				utils.Log("ERROR", "Error sending message to UserID: "+UserID)
				clients[UserID].Conn.Close()
				delete(clients, UserID)
			}
			utils.Log("INFO", fmt.Sprintf("Message sent to %s: %s", UserID, message.Content))
		}

		mutex.Unlock()
	}
}
