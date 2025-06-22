package realTime

import (
    "fmt"
    "socialNetwork/utils"
    "sync"

    "github.com/gorilla/websocket"
)

var groupClients = make(map[*Client]bool)
var broadcast = make(chan []byte)
var groupMutex = &sync.Mutex{}

func GroupChat(conn *websocket.Conn, username string) {
    client := &Client{
        Conn:     conn,
        Username: username,
        Send:     make(chan MessageStruct),
    }

    groupMutex.Lock()
    groupClients[client] = true
    utils.Log("INFO", "New Client is Connected to GroupChat")
    groupMutex.Unlock()

    go ReadMessages(client)
    go WriteMessages(client)
}

func ReadMessages(client *Client) {
    for {
        _, message, err := client.Conn.ReadMessage()
        if err != nil {
            groupMutex.Lock()
            delete(groupClients, client)
            groupMutex.Unlock()
            break
        }
        broadcast <- message
    }
}

func WriteMessages(c *Client) {
    for {
        message := <-broadcast

        groupMutex.Lock()
        for client := range groupClients {
            fmt.Println("Message sent: ", string(message))
            err := client.Conn.WriteMessage(websocket.TextMessage, message)
            if err != nil {
                client.Conn.Close()
                delete(groupClients, client)
            }
        }
        groupMutex.Unlock()
    }
}