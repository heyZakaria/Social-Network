"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/floating-chat.module.css";
import ChatComponent from "./chat-component";
import {
  IoClose,
  IoChatbubbleEllipses,
  IoCloseSharp,
  IoChatbubbleEllipsesSharp,
} from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";

import PrivacyToggle from "@/components/profile/privacy-toggle";
import FollowButton from "@/components/profile/follow-button";
import Image from "next/image";
import { broadcastChannel, socket, websocket } from "@/lib/websocket/websocket";
import { FetchData } from "@/context/fetchJson";
import { date } from "zod";
export default function FloatingChat({ currentUser, profileData, source, group }) {
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
        if (response?.data?.ChatList) {
          setUnreadCount(
            response.data.ChatList.reduce((acc, chat) => acc + chat.readed, 0)
          );
        }
        console.log("Unread Count", unreadCount);
      } catch (error) {
        console.error("Error fetching recent chats:", error);
      }
    };
    fetchRecentChats();
  }, [refresh]);
  console.log("Broadcast Channelx", broadcastChannel);
  broadcastChannel.onmessage = (event) => {
    console.log("BROD", event.data);
    refreshChatList()
  }
  if (socket && websocket) {
    socket.onmessage = () => {
      refreshChatList();
      broadcastChannel.postMessage(JSON.stringify({ type: "refresh_chat_list" }));
      console.log("List Refreched From Socket Floating chat comp");
    };
    broadcastChannel.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "refresh_chat_list") {
        refreshChatList("broadcast");
        console.log("List Refreched From Broadcast Channel Floating chat comp");
      }
    }
  }

  function generateChatSessionID(userID, receiverID) {
    if (userID < receiverID) {
      return `${userID}_${receiverID}`;
    }
    return `${receiverID}_${userID}`;
  }

  const GenerateChat = () => {
    console.log("group Data", group);
    const chat = {
      id: Date.now(),
    }
    if (source == "group") {
      chat.session_id = group.id
      chat.other_user_id = group.id
      chat.sender = currentUser.id
      chat.other_first_name = group.title
      chat.other_last_name = ""
      chat.type = "group_message"
      chat.other_avatar = group.covername || "/uploads/profile.jpeg"
    }else {
      chat.session_id = generateChatSessionID(currentUser?.id, profileData?.id)
      chat.other_user_id = profileData?.id
      chat.other_first_name = profileData?.firstName
      chat.type = "private_message"
      chat.other_last_name = profileData?.lastName
      chat.other_avatar = profileData?.avatar || "/uploads/profile.jpeg"
    }
    return chat;
  };
  const handleChatSelect = (chat) => {
    setActiveChat(chat);
    console.log("Chat Example 1", chat);
    console.log("Active Chat 1", activeChat);
    setIsOpen(true);
    setUnreadCount((prev) => prev - chat.readed);
  };

  const handleClose = () => {
    setIsOpen(false);
    setActiveChat(null);
  };

  const handleListChat = () => {
    setIsOpen(true);
    setActiveChat(null);
    refreshChatList();
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage((prevMessage) => prevMessage + emoji);
  };

  const refreshChatList = (from) => {
    console.log("Refreshing chat list form : ", from);
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
          {source === "profile" && (
            <FollowButton targetUserId={profileData?.id} />
          )}
          {profileData?.profile_status === "public" ||
          profileData?.CanView ||
          source == "group" ? (
            <button
              className={styles.messageButton}
              onClick={() => handleChatSelect(GenerateChat())}
            >
              {source == "group" ? (
                <>
                  <IoChatbubbleEllipsesSharp size={30} />
                  Chat ROOM
                </>
              ) : (
                "Message"
              )}
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
                      ) : (
                        ""
                      )}

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
