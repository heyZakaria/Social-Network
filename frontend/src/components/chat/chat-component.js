"use client";

import { useState, useEffect, useRef } from "react";
import styles from "@/styles/chat.module.css";
import EmojiPicker from "@/components/common/emoji-picker";
import { IoSendSharp } from "react-icons/io5";
import { IoClose } from "react-icons/io5";    
import { IoChatbubbleEllipses } from "react-icons/io5";


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
        setTimeout(() => {
          const mockMessages = [
            {
              id: 1,
              fromUserId: currentUser.id,
              toUserId: otherUser.id,
              content: "Hey, how's your photography project coming along? 📸",
              read: true,
              createdAt: "2023-03-26T10:30:00Z",
            },
            {
              id: 2,
              fromUserId: otherUser.id,
              toUserId: currentUser.id,
              content:
                "It's going great! I'll share some previews with you soon. 😊",
              read: true,
              createdAt: "2023-03-26T10:35:00Z",
            },
            {
              id: 3,
              fromUserId: currentUser.id,
              toUserId: otherUser.id,
              content:
                "That would be awesome! I'm looking forward to seeing them. 🙌",
              read: true,
              createdAt: "2023-03-26T10:40:00Z",
            },
          ];

          setMessages(mockMessages);
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
        <Image width={} height={}
          src={otherUser.avatar || "https://i.pravatar.cc/150?u=10`"}
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
