"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/floating-chat.module.css";
import ChatComponent from "./chat-component";
import EmojiPicker from "@/components/common/emoji-picker";
import { IoClose, IoChatbubbleEllipses, IoCloseSharp } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";

import PrivacyToggle from "@/components/profile/privacy-toggle";
import FollowButton from "@/components/profile/follow-button";
import Image from "next/image";
import { socket, websocket } from "@/lib/websocket/websocket";
import { FetchData } from "@/context/fetchJson";
import { date } from "zod";
export default function FloatingChat({ currentUser, profileData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [recentChats, setRecentChats] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll use mock data
    const fetchRecentChats = async () => {
      try {
        const response = await FetchData(
          `/api/websocket/Get_Chat_History?chat_list=fetch`
        );
        console.log(
          "Response List Of users Chat History ",
          response?.data?.ChatList
        );
        setRecentChats(response?.data?.ChatList || []);
        console.log("recent chat", response?.data?.ChatList);
        
        setUnreadCount(response.data.ChatList.reduce((acc, chat) => acc + chat.readed, 0));
        console.log("Unread Count", unreadCount);
        
      } catch (error) {
        console.error("Error fetching recent chats:", error);
      }
    };

    fetchRecentChats();
  }, [refresh]);

  if (socket && websocket) {
    socket.onmessage = (event) => {
      refreshChatList();

      console.log("List Refreched From Floating chat comp");
    };
  }

  function generateChatSessionID(userID, receiverID) {
    if (userID < receiverID) {
      return `${userID}_${receiverID}`;
    }
    return `${receiverID}_${userID}`;
  }

  const GenerateChat = () => {
    console.log("Profile Data", profileData);

    const chat = {
      id: Date.now(),
      session_id: generateChatSessionID(currentUser.id, profileData.id),
      other_user_id: profileData.id,
      other_first_name: profileData.firstName,
      other_last_name: profileData.lastName,
      other_avatar: profileData.avatar || "/uploads/profile.jpeg",
    };
    return chat;
  };
  const handleChatSelect = (chat) => {
    setActiveChat(chat);
    console.log("Chat Example", chat);
    console.log("Active Chat", activeChat);
    setIsOpen(true);
    setUnreadCount((prev) => prev - chat.readed)
  };

  const handleClose = () => {
    setIsOpen(false);
    setActiveChat(null);
  };

  const handleListChat = () => {
    setIsOpen(true);
    setActiveChat(null);
    refreshChatList()
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage((prevMessage) => prevMessage + emoji);
  };

  const refreshChatList = () => {
    setRefresh((prev) => prev + 1);
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
    <>
      
        {profileData?.IsOwnProfile ? (
          <div className={styles.profileActions}>
            {/* <Link href="/settings" className={styles.editButton}>
            Edit Profile
          </Link> */}

            <PrivacyToggle user={profileData} />
          </div>
        ) : (
          <div className={styles.profileActions}>
            <FollowButton targetUserId={profileData?.id} />
            {profileData?.profile_status === "public" || profileData?.CanView ? (
              <button
                className={styles.messageButton}
                onClick={() => handleChatSelect(GenerateChat())}
              >
                Message
              </button>
            ) : null}
          </div>
        )}

      <div className={styles.floatingChatContainer}>
        {isOpen && activeChat ? (
          <div className={styles.chatWindow}>
            <div className={styles.chatHeader}>
              <div className={styles.chatHeaderInfo}>
                <div className={styles.backArrow}>
                  <IoIosArrowBack size={24} onClick={handleListChat} />
                </div>
                <Image
                  width={20}
                  height={20}
                  src={activeChat.avatar || "/uploads/profile.jpeg"}
                  alt={activeChat.other_first_name}
                  className={styles.chatHeaderAvatar}
                />
                <div className={styles.chatHeaderName}>
                  {activeChat.other_first_name} {activeChat.other_last_name}
                </div>
              </div>
              <div className={styles.chatHeaderActions}>
                <button
                  className={styles.chatHeaderAction}
                  onClick={handleClose}
                >
                  <IoCloseSharp size={24} />
                </button>
              </div>
            </div>
            <div className={styles.chatBody}>
              <ChatComponent
                currentUser={currentUser}
                otherUser={activeChat}
                refresh={refreshChatList}
                activeChat={activeChat}
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
              {recentChats?.length > 0 ? (
                recentChats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`${styles.chatListItem} ${
                      chat.readed > 0 ? styles.unread : ""
                    }`}
                    onClick={() => handleChatSelect(chat)}
                  >
                    <div className={styles.chatListItemAvatar}>
                      {chat.readed > 0 ? (
                        <div className={styles.totalunreaded}>
                          <span>{chat.readed}</span>
                        </div>
                        ):("")
                      }
                      
                      <Image
                        width={200}
                        height={100}
                        src={chat.avatar || "/uploads/profile.jpeg"}
                        alt={chat.other_first_name}
                      />
                      {/* {chat.user.isOnline && (
                      <div className={styles.onlineIndicator}></div>
                    )} */}
                    </div>
                    <div className={styles.chatListItemInfo}>
                      <div className={styles.chatListItemName}>
                        {chat.other_first_name} {chat.other_last_name}
                      </div>
                      <div className={styles.chatListItemMessage}>
                        {chat.content}
                      </div>
                    </div>
                    <div className={styles.chatListItemMeta}>
                      <div className={styles.chatListItemTime}>
                        {formatTime(chat.createdAt)}
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
    </>
  );
}
