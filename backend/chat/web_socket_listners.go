package chat

import (
	"fmt"
	Shared_groups "socialNetwork/groups_shared"
	Shared_Profile "socialNetwork/profile_shared"
	"socialNetwork/utils"
	"sync"
)

var Clients = make(map[string]*Client)

// var broadcast = make(chan MessageStruct)
var mutex = &sync.Mutex{}

func ReadMessages(UserID string) {
	client, ok := Clients[UserID]
	if !ok || client == nil || client.Conn == nil {
		utils.Log("ERROR", "Client not found or connection is nil for UserID: "+UserID)
		return
	}
	var msgs MessageStruct
	var err error

	for {
		mutex.Lock()
		client, ok := Clients[UserID]
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
			delete(Clients, UserID)
			mutex.Unlock()
			break
		}

		if msgs.Type == "" || msgs.Receiver == "" || msgs.Content == "" {
			utils.Log("ERROR", " Receiver OR Type or Content is empty")

			continue
		}
		utils.Log("INFO", "Message received: "+msgs.Content)

		var shouldContinue bool
		switch msgs.Type {
		case "private_message":
			shouldContinue = msgs.Private_Chat(UserID)
		case "group_message":
			shouldContinue = msgs.Group_Chat(UserID)
		}
		if shouldContinue {
			continue
		}

		mutex.Lock()
		client, ok = Clients[UserID]
		mutex.Unlock()
		if ok {
			client.Broadcast <- msgs
		}
	}
}

func WriteMessages(UserID string) {
	profile, _ := Shared_Profile.GetUserProfileData(UserID)

	for {
		// Grab the next message from the broadcast channel
		client, ok := Clients[UserID]
		if !ok || client == nil || client.Broadcast == nil {
			utils.Log("ERROR", "Problem passing data through the channel")
			mutex.Unlock()
			continue
		}
		message := <-Clients[UserID].Broadcast

		mutex.Lock()
		var ReciverNotFound = false
		client, ok = Clients[message.Receiver]
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
			groupMembers, err := Shared_groups.GetMembersOfGroup(message.SessionID, UserID)
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
				client, ok = Clients[member.User_id]
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
	err := Clients[UserID].Conn.WriteJSON(message)
	if err != nil {
		utils.Log("ERROR", "Error sending message to Receiver: "+UserID)
		Clients[UserID].Conn.Close()
		delete(Clients, UserID)
	}
	utils.Log("INFO", fmt.Sprintf("Message sent to %s: %s", UserID, message.Content))
}
