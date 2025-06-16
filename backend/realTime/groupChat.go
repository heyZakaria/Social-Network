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
		shouldConitnue := Chat_And_History(msgs, UserID)
		if shouldConitnue {
			continue
		}

		mutex.Lock()
		client, ok = clients[UserID]
		mutex.Unlock()
		if ok {
			client.Broadcast <- msgs
		}
	}
}

func Chat_And_History(msgs MessageResponse, UserID string) bool {
	if (msgs.Single.Type == "private_message" || msgs.Single.Type == "fetch_messages") && (msgs.Single.Receiver != UserID) {
		db.DB.QueryRow(`SELECT chat_session_id FROM chats WHERE sender_id = ? AND receiver_id = ?
			OR receiver_id = ? AND sender_id = ? LIMIT 1`, UserID, msgs.Single.Receiver, UserID, msgs.Single.Receiver).
			Scan(&msgs.Single.SessionID)

		// Fetching History of chat
		if msgs.Single.Type == "fetch_messages" && msgs.Single.SessionID != "" {
			var message MessageStruct
			fmt.Println("Fetching messages for session ID:", msgs.Single.SessionID)
			rows, err := db.DB.Query("SELECT sender_id, receiver_id, message_content, message_type, created_at FROM chats WHERE session_id = ?", msgs.Single.SessionID)
			if err != nil {
				utils.Log("ERROR", "Error fetching messages from database: "+err.Error())
				return true
			}
			defer rows.Close()
			for rows.Next() {
				err = rows.Scan(&message.Sender, &message.Receiver, &message.Content, &message.Type)
				if err != nil {
					utils.Log("ERROR", "Error scanning row: "+err.Error())
					continue
				}
			}
			msgs.Multiple = append(msgs.Multiple, message)
			return true
		}

		//Generating the session ID
		if msgs.Single.SessionID == "" {
			msgs.Single.FirstTime = true
			utils.Log("INFO", "No existing chat session found, creating a new one")
			msgs.Single.SessionID = utils.GenerateChatSessionID(UserID, msgs.Single.Receiver)
			utils.Log("INFO", "New chat session ID created: "+msgs.Single.SessionID)
		}
		// Save Chat into Database
		shouldReturn, b := msgs.InsertDB(UserID)
		if shouldReturn {
			return b
		}
	}
	return false
}

func (msgs *MessageResponse) InsertDB(UserID string) (bool, bool) {
	stmnt, err := db.DB.Prepare("INSERT INTO chats (session_id, sender_id, receiver_id, message_content, message_type) VALUES (?, ?, ?, ?, ?)")
	fmt.Println("Whole MSG :", msgs)
	if err != nil {
		utils.Log("ERROR", "Error preparing statement: "+err.Error())
		return true, true
	}
	defer stmnt.Close()
	_, err = stmnt.Exec(msgs.Single.SessionID, UserID, msgs.Single.Receiver, msgs.Single.Content, msgs.Single.Type)
	if err != nil {
		utils.Log("ERROR", "Error inserting message into database: "+err.Error())
		return true, true
	}
	return false, false
}

func WriteMessages(UserID string) {
	for {
		// Grab the next message from the broadcast channel
		message := <-clients[UserID].Broadcast

		mutex.Lock()
		var err error
		client, ok := clients[message.Single.Receiver]
		if !ok || client == nil || client.Conn == nil {
			utils.Log("ERROR", "Client not found or connection is nil for Receiver: "+message.Single.Receiver)
			mutex.Unlock()
			continue
		}
		if message.Single.Type == "private_message" {
			err = clients[message.Single.Receiver].Conn.WriteJSON(message)
			if err != nil {
				utils.Log("ERROR", "Error sending message to Receiver: "+message.Single.Receiver)
				clients[message.Single.Receiver].Conn.Close()
				delete(clients, message.Single.Receiver)
			}
			utils.Log("INFO", fmt.Sprintf("Message sent to %s: %s", message.Single.Receiver, message.Single.Content))
			err = clients[UserID].Conn.WriteJSON(message)
			if err != nil {
				utils.Log("ERROR", "Error sending message to UserID: "+UserID)
				clients[UserID].Conn.Close()
				delete(clients, UserID)
			}
			utils.Log("INFO", fmt.Sprintf("Message sent to %s: %s", UserID, message.Single.Content))
		} else if message.Single.Type == "fetch_messages" {
			err = clients[UserID].Conn.WriteJSON(message)
			if err != nil {
				utils.Log("ERROR", "Error sending history to the user: "+UserID)
				clients[UserID].Conn.Close()
				delete(clients, UserID)
			}
			utils.Log("INFO", fmt.Sprintf("History sent to %s: %s", UserID))
		}

		mutex.Unlock()
	}
}
