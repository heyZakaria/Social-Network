"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/floating-chat.module.css";
import ChatComponent from "./chat-component";
import EmojiPicker from "@/components/common/emoji-picker";
import { IoClose, IoSendSharp, IoChatbubbleEllipses } from "react-icons/io5";
import Image from "next/image";
import { websocket } from "@/lib/websocket/websocket";
export default function FloatingChat({ currentUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [recentChats, setRecentChats] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll use mock data
    const fetchRecentChats = async () => {
      try {
        // Simulate API call
        const mockChats = [
          {
            id: 1,
            user: {
              id: "1def295f-6cb0-4257-b8f1-a7e7a7205e03",
              firstName: "سعيد",
              lastName: "طويل",
              avatar: "/uploads/profile.jpeg",
              isOnline: true,
            },
            lastMessage: {
              content:
                "It's going great! I'll share some previews with you soon. 😊",
              timestamp: "2023-03-26T10:35:00Z",
              isRead: true,
            },
            unreadCount: 0,
          },
          {
            id: 2,
            user: {
              id: "2ae22a0b-a316-475e-a8a4-6ccf86bb1aa1",
              firstName: "med",
              lastName: "as",
              avatar: "/uploads/profile.jpeg",
              isOnline: true,
            },
            lastMessage: {
              content:
                "It's going great! I'll share some previews with you soon. 😊",
              timestamp: "2023-03-26T10:35:00Z",
              isRead: true,
            },
            unreadCount: 0,
          },
        ];

        setRecentChats(mockChats);
        setUnreadCount(
          mockChats.reduce((acc, chat) => acc + chat.unreadCount, 0)
        );
      } catch (error) {
        console.error("Error fetching recent chats:", error);
      }
    };

    fetchRecentChats();
  }, []);

  const handleChatSelect = (chat) => {
    setActiveChat(chat);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setActiveChat(null);
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage((prevMessage) => prevMessage + emoji);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !activeChat) return;

    // In a real app, this would send the message through WebSocket
    // this is simple of the data that backend expects
    // type MessageStruct struct {
    //   Sender    string `json:"sender"`
    //   Receiver  string `json:"receiver"`
    //   Content   string `json:"content"`
    //   Type      string `json:"type"`
    //   FirstTime bool   `json:"first_time"`
    //   SessionID string `json:"session_id"`
    // }
    console.log("handleSendMessage Function called with message:", newMessage);
    
    websocket.send({
      sender: currentUser.id,
      receiver: activeChat.user.id,
      content: newMessage,
      type: "private_message",
      first_time: false,//
      session_id: "", // Assuming session_id is the chat ID
    });
    console.log("Message sent:", {
      sender: currentUser.id,
      receiver: activeChat.user.id,
      content: newMessage,
      type: "private_message",
      first_time: false,
      session_id: "",
    });
    
    // Reset input
    setNewMessage("");
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d`;
    }
  };

  return (
    <div className={styles.floatingChatContainer}>
      {isOpen && activeChat ? (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <div className={styles.chatHeaderInfo}>
              <Image width={20} height={20}
                src={
                  activeChat.user.avatar ||
                  "/placeholder.svg?height=32&width=32"
                }
                alt={activeChat.user.firstName}
                className={styles.chatHeaderAvatar}
              />
              <div className={styles.chatHeaderName}>
                {activeChat.user.firstName} {activeChat.user.lastName}
              </div>
            </div>
            <div className={styles.chatHeaderActions}>
              <button className={styles.chatHeaderAction} onClick={handleClose}>
              <IoChatbubbleEllipses size={24} />
              </button>
            </div>
          </div>
          <div className={styles.chatBody}>
            <ChatComponent
              currentUser={currentUser}
              otherUser={activeChat.user}
            />
          </div>
        </div>
      ) : (
        <div className={styles.chatButton} onClick={() => setIsOpen(true)}>
          <IoChatbubbleEllipses size={24} />
          {unreadCount > 0 && (
            <span className={styles.unreadBadge}>{unreadCount}</span>
          )}
        </div>
      )}

      {isOpen && !activeChat && (
        <div className={styles.chatList}>
          <div className={styles.chatListHeader}>
            <h3>Messages</h3>
            <button
              className={styles.chatListClose}
              onClick={() => setIsOpen(false)}
            >
              <IoClose size={16} />
            </button>
          </div>
          <div className={styles.chatListContent}>
            {recentChats.length > 0 ? (
              recentChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`${styles.chatListItem} ${
                    chat.unreadCount > 0 ? styles.unread : ""
                  }`}
                  onClick={() => handleChatSelect(chat)}
                >
                  <div className={styles.chatListItemAvatar}>
                    <Image width={200} height={100}
                      src={
                        chat.user.avatar || "/uploads/profile.jpeg"
                      }
                      alt={chat.user.firstName}
                    />
                    {chat.user.isOnline && (
                      <div className={styles.onlineIndicator}></div>
                    )}
                  </div>
                  <div className={styles.chatListItemInfo}>
                    <div className={styles.chatListItemName}>
                      {chat.user.firstName} {chat.user.lastName}
                    </div>
                    <div className={styles.chatListItemMessage}>
                      {chat.lastMessage.content}x
                    </div>
                  </div>
                  <div className={styles.chatListItemMeta}>
                    <div className={styles.chatListItemTime}>
                      {formatTime(chat.lastMessage.timestamp)}
                    </div>
                    {chat.unreadCount > 0 && (
                      <div className={styles.chatListItemBadge}>
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>No recent messages</div>
            )}
          </div>
          {/* <div className={styles.chatListFooter}>
            <form
              className={styles.quickMessageForm}
              onSubmit={handleSendMessage}
            >
              <div className={styles.quickMessageInputContainer}>
                <input
                  type="text"
                  placeholder="New message..."
                  className={styles.quickMessageInput}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <div className={styles.quickMessageActions}>
                  <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                </div>
              </div>
              <button
                type="submit"
                className={styles.quickMessageSubmit}
                disabled={!newMessage.trim()}
              >
                 <IoSendSharp size={16} />
              </button>
            </form>
          </div> */}
        </div>
      )}
    </div>
  );
}
