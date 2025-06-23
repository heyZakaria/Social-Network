package realTime

import (
	"fmt"
	db "socialNetwork/db/sqlite"
	Group "socialNetwork/groups"
	"socialNetwork/profile"
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
		mutex.Lock()
		client, ok := clients[UserID]
		mutex.Unlock()
		if !ok || client == nil || client.Conn == nil {
			utils.Log("ERROR", "Client not found or connection is nil for UserID: "+UserID)
			break
		}

		err = client.Conn.ReadJSON(&msgs)
		if err != nil {
			utils.Log("ERROR", "Error reading JSON: "+err.Error())
			client.Conn.Close()
			mutex.Lock()
			delete(clients, UserID)
			mutex.Unlock()
			break
		}
		fmt.Println("Content:", "Value:", msgs.Content)
		fmt.Println("Type:", "Value:", msgs.Type)
		fmt.Println("Reciver:", "Value:", msgs.Receiver)
		fmt.Println("Sender:", "Value:", msgs.Sender)
		fmt.Println("SessionID:", "Value:", msgs.SessionID)
		fmt.Println("FirstTime:", "Value:", msgs.FirstTime)
		fmt.Println("Readed:", "Value:", msgs.Readed)
		fmt.Println("CreatedAt:", "Value:", msgs.CreatedAt)
		fmt.Println("Other_user_id:", "Value:", msgs.Other_user_id)
		fmt.Println("Other_first_name:", "Value:", msgs.Other_first_name)
		fmt.Println("Other_last_name:", "Value:", msgs.Other_last_name)
		fmt.Println("Other_avatar:", "Value:", msgs.Other_avatar)

		if msgs.Type == "" || msgs.Receiver == "" || msgs.Content == "" {
			utils.Log("ERROR", " Receiver OR Type or Content is empty")
			fmt.Println(msgs)
			continue
		}
		utils.Log("INFO", "Message received: "+msgs.Content)

		var shouldConitnue bool
		switch msgs.Type {
		case "private_message":
			shouldConitnue = msgs.Private_Chat(UserID)
		case "group_message":
			shouldConitnue = msgs.Group_Chat(UserID)
		}
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
func (msgs *MessageStruct) Group_Chat(UserID string) bool {
	if msgs.SessionID == "" {
		utils.Log("ERROR", "Session ID is empty for group message")
		return true
	}
	// Save Chat into Database
	shouldReturn, b := msgs.InsertDB(UserID)
	if shouldReturn {
		return b
	}
	return false
}
func (msgs *MessageStruct) Private_Chat(UserID string) bool {
	if msgs.Receiver != UserID {
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

	stmnt, err := db.DB.Prepare(Insert_queries[msgs.Type])
	fmt.Println("Whole MSG :", msgs)
	if err != nil {
		utils.Log("ERROR", "Error preparing statement: "+err.Error())
		return true, true
	}
	defer stmnt.Close()

	var Receiver string
	if msgs.Type == "private_message" {
		Receiver = msgs.Receiver
	} else {
		Receiver = msgs.GroupID
	}
	fmt.Println("Query:", Insert_queries[msgs.Type])
	fmt.Println("SessionID:", msgs.SessionID)
	fmt.Println("UserID:", UserID)
	fmt.Println("Receiver:", Receiver)
	fmt.Println("msgs.Receiver:", msgs.Receiver)
	fmt.Println("msgs.GroupID:", msgs.GroupID)
	fmt.Println("Content:", msgs.Content)
	// Execute the statement with the provided parameters
	_, err = stmnt.Exec(msgs.SessionID, UserID, Receiver, msgs.Content)
	if err != nil {
		utils.Log("ERROR", "Error inserting group message into database: "+err.Error())
		return true, true
	}

	return false, false
}

func WriteMessages(UserID string) {
	profile, _ := profile.GetUserProfileData(UserID)
	fmt.Println("Profile for UserID:", UserID, "is", profile)

	for {
		// Grab the next message from the broadcast channel
		client, ok := clients[UserID]
		fmt.Println("Client found message", ok, client)

		if !ok || client == nil || client.Broadcast == nil {
			utils.Log("ERROR", "Problem passing data through the channel")
			mutex.Unlock()
			continue
		}
		message := <-clients[UserID].Broadcast
		fmt.Println("Writing message", message)

		mutex.Lock()
		var ReciverNotFound = false
		client, ok = clients[message.Receiver]
		if !ok || client == nil || client.Conn == nil {
			utils.Log("ERROR", "Client not found or connection is nil for Receiver: "+message.Receiver)
			ReciverNotFound = true
		}
		// For Private MSGS
		if message.Type == "private_message" {
			if !ReciverNotFound {
				WriteMessage(message.Receiver, message)
			}
			WriteMessage(UserID, message)
		} else if message.Type == "group_message" {
			groupMembers, err := Group.GetMembersOfGroup(message.SessionID, UserID)
			if err != nil {
				utils.Log("ERROR", "Error getting group members: "+err.Error())
				mutex.Unlock()
				continue
			}
			if groupMembers == nil {
				utils.Log("ERROR", "No group members found for group: "+message.SessionID)
				mutex.Unlock()
				continue
			}

			for _, member := range groupMembers {
				client, ok = clients[member.User_id]
				if !ok || client == nil || client.Conn == nil {
					utils.Log("ERROR", "Client not found or connection is nil for Receiver: "+member.User_id)
					continue
				}
				message.Other_avatar = profile.Avatar
				message.Other_first_name = profile.FirstName
				message.Other_last_name = profile.LastName
				WriteMessage(member.User_id, message)
			}
		}

		mutex.Unlock()
	}
}

func WriteMessage(UserID string, message MessageStruct) {
	err := clients[UserID].Conn.WriteJSON(message)
	if err != nil {
		utils.Log("ERROR", "Error sending message to Receiver: "+UserID)
		clients[UserID].Conn.Close()
		delete(clients, UserID)
	}
	utils.Log("INFO", fmt.Sprintf("Message sent to %s: %s", UserID, message.Content))
}
