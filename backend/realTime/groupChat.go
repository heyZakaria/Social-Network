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
	var msgs MessageStruct
	var err error

	for {
		err = client.Conn.ReadJSON(&msgs)
		if err != nil {
			utils.Log("ERROR", "Error reading JSON: "+err.Error())
			client.Conn.Close()
			mutex.Lock()
			delete(clients, UserID)
			mutex.Unlock()
			break
		}

		if msgs.Type == "" || msgs.Receiver == "" || msgs.Content == "" {
			utils.Log("ERROR", " Receiver OR Type or Content is empty")
			fmt.Println(msgs)
			continue
		}

		utils.Log("INFO", "Message received: "+msgs.Content)
		shouldConitnue := msgs.Proccess_Chat(UserID)
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

func (msgs *MessageStruct) Proccess_Chat(UserID string) bool {
	if (msgs.Type == "private_message") && (msgs.Receiver != UserID) {
		db.DB.QueryRow(`SELECT chat_session_id FROM chats WHERE sender_id = ? AND receiver_id = ?
			OR receiver_id = ? AND sender_id = ? LIMIT 1`, UserID, msgs.Receiver, UserID, msgs.Receiver).
			Scan(&msgs.SessionID)
		//Generating the session ID
		if msgs.SessionID == "" {
			msgs.FirstTime = true
			utils.Log("INFO", "No existing chat session found, creating a new one")
			msgs.SessionID = utils.GenerateChatSessionID(UserID, msgs.Receiver)
			utils.Log("INFO", "New chat session ID created: "+msgs.SessionID)
		}
		// Save Chat into Database
		shouldReturn, b := msgs.InsertDB(UserID)
		if shouldReturn {
			return b
		}
	}
	return false
}

func (msgs *MessageStruct) InsertDB(UserID string) (bool, bool) {
	stmnt, err := db.DB.Prepare("INSERT INTO chats (session_id, sender_id, receiver_id, message_content, message_type) VALUES (?, ?, ?, ?, ?)")
	fmt.Println("Whole MSG :", msgs)
	if err != nil {
		utils.Log("ERROR", "Error preparing statement: "+err.Error())
		return true, true
	}
	defer stmnt.Close()
	_, err = stmnt.Exec(msgs.SessionID, UserID, msgs.Receiver, msgs.Content, msgs.Type)
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
		client, ok := clients[message.Receiver]
		if !ok || client == nil || client.Conn == nil {
			utils.Log("ERROR", "Client not found or connection is nil for Receiver: "+message.Receiver)
			mutex.Unlock()
			continue
		}
		// For Private MSGS
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
		} else if message.Type == "fetch_messages" {
			// FOR Fech History of CHAT
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
