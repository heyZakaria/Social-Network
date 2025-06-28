"use client";

import { useState, useEffect, useRef } from "react";
import styles from "@/styles/chat.module.css";
import EmojiPicker from "@/components/common/emoji-picker";
import { IoSendSharp } from "react-icons/io5";
import Image from "next/image";
import {socket, websocket, broadcastChannel } from "@/lib/websocket/websocket";

export default function ChatComponent({ currentUser, otherUser , refresh, activeChat}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
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
          const res = await fetch(`/api/websocket/Get_Chat_History?session_id=${otherUser.session_id}`)
          const response = await res.json();
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
  }, [currentUser.id, otherUser.other_user_id, otherUser.session_id]);

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
      receiver: `${otherUser.other_user_id}`,
      content: newMessage,
      type: activeChat.type || "private_message",
      first_time: false,//
      session_id: `${activeChat.session_id}` || "", // Assuming session_id is the chat ID
      group_id: `${otherUser.other_user_id}` || "", // Assuming group_id is the chat ID for group chats
      // other_first_name: "test"
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
  
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type == "error"){
      socket.close();
      return;
    }
    const newMsg = GenerateChat(data);
    broadcastChannel.postMessage(JSON.stringify(newMsg));
  }
  
  if (broadcastChannel) {
    broadcastChannel.onmessage = (event) => {
      // refresh("from broadcast channel");
      const data = JSON.parse(event.data);
      GenerateChat(data);
    }
  } else {
      console.warn("BroadcastChannel is not supported in this environment.");
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

      <div className={styles.chatMessages}>
        {isLoading ? (
          <div className={styles.loading}>Loading messages...</div>
        ) : messages?.length > 0 ? (
          messages.map((message) => {
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
                  {isOwnMessage ? "You" : message.other_first_name ? message.other_first_name : activeChat.other_first_name} {" "}
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

  function GenerateChat(data) {
    const newMsg = {
      id: Date.now(),
      read: false,
      sender: data.sender,
      receiver: data.receiver,
      content: data.content,
      type: data.type,
      first_time: false, //
      session_id: data.session_id, // Assuming session_id is the chat ID
      createdAt: new Date().toISOString(),
      other_first_name: data.other_first_name || ""
    };


    if (currentUser.id == data.receiver && activeChat.other_user_id == data.sender ||
      activeChat.other_user_id == data.receiver) {
        setMessages((prevMessages) => [...prevMessages, newMsg]);
        if (data.receiver == activeChat.other_user_id) {
        fetch(`/api/websocket/set_readed?session_id=${data.session_id}`);
      }
    }
    return newMsg;
  }
}