"use client";

import { useState, useEffect, useRef } from "react";
import styles from "@/styles/chat.module.css";
import EmojiPicker from "@/components/common/emoji-picker";
import { IoSendSharp } from "react-icons/io5";
import Image from "next/image";
import {socket, websocket } from "@/lib/websocket/websocket";
import { FetchData } from "@/context/fetchJson";



export default function ChatComponent({ currentUser, otherUser , refresh, activeChat}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  console.log("otherUser", otherUser);
  
  useEffect(() => {
    // In a real app, this would be a WebSocket connection
    // For now, we'll use mock data
    const fetchMessages = async () => {
      try {
        // Simulate API call
        // Fetch messages from the server or WebSocket
        // Send websocket message to fetch initial messages
        setIsLoading(true);
        // Generate Session id 
       
        setTimeout(async () => {
          const response = await FetchData(`/api/websocket/Get_Chat_History?session_id=${otherUser.session_id}`)
          console.log("Response Chat History", response);
          setMessages(response?.data?.Messages || []);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setIsLoading(false);
      }
    };

    fetchMessages();

    // In a real app, we would set up a WebSocket connection here
    // and clean it up in the return function
  }, [currentUser.id, otherUser.other_user_id]);

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    // In a real app, this would send the message through WebSocket
    // For now, we'll just add it to the local state
    websocket.send({
      sender: currentUser.id,
      receiver: otherUser.other_user_id,
      content: newMessage,
      type: "private_message",
      first_time: false,//
      session_id: "", // Assuming session_id is the chat ID
    });
    refresh()
    setNewMessage("");
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage((prevMessage) => prevMessage + emoji);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
//   {
//     "id": 0,
//     "sender": "6f336313-eb72-47c7-b727-c9fd1732e5a0",
//     "receiver": "1def295f-6cb0-4257-b8f1-a7e7a7205e03",
//     "content": "New MESSAGE ",
//     "type": "private_message",
//     "first_time": true,
//     "session_id": "1def295f-6cb0-4257-b8f1-a7e7a7205e03_6f336313-eb72-47c7-b727-c9fd1732e5a0",
//     "createdAt": null,
//     "other_user_id": "",
//     "other_first_name": "",
//     "other_last_name": "",
//     "other_avatar": ""
// }
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
        const newMsg = {
          id: Date.now(),
          read: false,
          sender: data.sender,
          receiver: data.receiver,
          content: data.content,
          type: data.type,
          first_time: false,//
          session_id: data.session_id, // Assuming session_id is the chat ID
          createdAt: new Date().toISOString(),
        };
      setMessages((prevMessages) => [...prevMessages, newMsg]);
      if (data.receiver == currentUser.id){
        fetch(`/api/websocket/set_readed?session_id=${data.session_id}`);
      }
    console.log("Message received in Chat CompLD:", data);
  }

  // if (socket && isOpen){
  //   socket.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     const newMsg = {
  //       id: Date.now(),
  //       read: false,
  //       sender: currentUser.id,
  //       receiver: otherUser.id,
  //       content: newMessage,
  //       type: "private_message",
  //       first_time: false,//
  //       session_id: "", // Assuming session_id is the chat ID
  //       createdAt: new Date().toISOString(),
  //     };
  //     setMessages((prevMessages) => [...prevMessages, newMsg]);

  //     console.log("➡️ Message received in Chat Comp:", data);
  //   };
  // }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <Image width={200} height={100}
          src={otherUser.avatar || "/uploads/profile.jpeg"}
          alt={otherUser.other_first_name}
          className={styles.chatAvatar}
        />
        <div className={styles.chatInfo}>
          <div className={styles.chatName}>
            {otherUser.other_first_name} {otherUser.other_last_name}
          </div>
          <div className={styles.chatStatus}>Online</div>
        </div>
      </div>

      <div className={styles.chatMessages}>
        {isLoading ? (
          <div className={styles.loading}>Loading messages...</div>
        ) : messages?.length > 0 ? (
          messages.map((message) => {
            console.log("currentUser.id", message, );
            console.log("message.Sender.id", message.Sender, );
            
            const isOwnMessage = message.sender === currentUser.id;

            return (
              <div
                key={message.id}
                className={`${styles.message} ${
                  isOwnMessage ? styles.ownMessage : ""
                }`}
              >
                <div className={styles.messageContent}>{message.content}</div>
                <div className={styles.messageTime}>
                  {formatTime(message.createdAt)}
                </div>
              </div>
            );
          })
        ) : (
          <div className={styles.emptyState}>
            No messages yet. Start the conversation!
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className={styles.chatForm} onSubmit={handleSendMessage}>
        <div className={styles.chatInputContainer}>
          <input
            type="text"
            placeholder="Type a message..."
            className={styles.chatInput}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <div className={styles.chatInputActions}>
            <EmojiPicker onEmojiSelect={handleEmojiSelect} />
          </div>
        </div>
        <button
          type="submit"
          className={styles.sendButton}
          disabled={!newMessage.trim()}
        >
           <IoSendSharp size={20} />
        </button>
      </form>
    </div>
  );
}
