"use client";

import { useState, useEffect, useRef } from "react";
import styles from "@/styles/chat.module.css";
import EmojiPicker from "@/components/common/emoji-picker";
import { IoSendSharp } from "react-icons/io5";
import Image from "next/image";
import { websocket } from "@/lib/websocket/websocket";


export let Messages = [];

export default function ChatComponent({ currentUser, otherUser }) {
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
        setTimeout(() => {
           websocket.send({
            sender: currentUser.id,
            receiver: otherUser.id,
            type: "fetch_messages",
            session_id: "", // Assuming session_id is the chat ID
          });

          setMessages(Messages);
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
  }, [currentUser.id, otherUser.id]);

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
    const newMsg = {
      id: Date.now(),
      fromUserId: currentUser.id,
      toUserId: otherUser.id,
      content: newMessage,
      read: false,
      createdAt: new Date().toISOString(),
    };

     console.log("handleSendMessage Function called with message:", newMessage);
        websocket.send({
          sender: currentUser.id,
          receiver: otherUser.id,
          content: newMessage,
          type: "private_message",
          first_time: false,//
          session_id: "", // Assuming session_id is the chat ID
        });
        console.log("Message sent:", {
          sender: currentUser.id,
          receiver: otherUser.id,
          content: newMessage,
          type: "private_message",
          first_time: false,
          session_id: "",
        });
    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage((prevMessage) => prevMessage + emoji);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <Image width={200} height={100}
          src={otherUser.avatar || "/uploads/profile.jpeg"}
          alt={otherUser.firstName}
          className={styles.chatAvatar}
        />
        <div className={styles.chatInfo}>
          <div className={styles.chatName}>
            {otherUser.firstName} {otherUser.lastName}
          </div>
          <div className={styles.chatStatus}>Online</div>
        </div>
      </div>

      <div className={styles.chatMessages}>
        {isLoading ? (
          <div className={styles.loading}>Loading messages...</div>
        ) : messages.length > 0 ? (
          messages.map((message) => {
            const isOwnMessage = message.fromUserId === currentUser.id;

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
