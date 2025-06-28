"use client";

import { useState, useEffect, useRef } from "react";
import styles from "@/styles/chat.module.css";
import EmojiPicker from "@/components/common/emoji-picker";
import { IoSendSharp } from "react-icons/io5";
import { socket, websocket, broadcastChannel } from "@/lib/websocket/websocket";
import { FetchData } from "@/context/fetchJson";

export default function ChatComponent({ currentUser, otherUser, refresh, activeChat }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        setTimeout(async () => {
          const response = await FetchData(`http://localhost:8080/api/websocket/Get_Chat_History?session_id=${otherUser.session_id}`);
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
  }, [currentUser.id, otherUser.other_user_id, otherUser.session_id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) {
      console.warn("Socket is null. Cannot attach onmessage.");
      return;
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("WebSocket message received:", data);

      if (data.type === "error" && data.sender === currentUser.id) {
        console.error("WebSocket Error:", data.message);
        socket.close();
        document.location.href = "/login";
        return;
      }

      const newMsg = GenerateChat(data);
      broadcastChannel?.postMessage(JSON.stringify(newMsg));
    };

    return () => {
      socket.onmessage = null;
    };
  }, [currentUser.id, activeChat]);

  useEffect(() => {
    if (!broadcastChannel) {
      console.warn("BroadcastChannel not supported or null.");
      return;
    }

    broadcastChannel.onmessage = (event) => {
      const data = JSON.parse(event.data);
      refresh("from broadcast channel");
      GenerateChat(data);
    };

    return () => {
      broadcastChannel.onmessage = null;
    };
  }, [broadcastChannel, refresh]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    websocket.send({
      sender: currentUser.id,
      receiver: `${otherUser.other_user_id}`,
      content: newMessage,
      type: activeChat.type || "private_message",
      first_time: false,
      session_id: `${activeChat.session_id}` || "",
      group_id: `${otherUser.other_user_id}` || "",
    });

    refresh();
    setNewMessage("");
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage((prevMessage) => prevMessage + emoji);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  function GenerateChat(data) {
    const newMsg = {
      id: Date.now(),
      read: false,
      sender: data.sender,
      receiver: data.receiver,
      content: data.content,
      type: data.type,
      first_time: false,
      session_id: data.session_id,
      createdAt: new Date().toISOString(),
      other_first_name: data.other_first_name || ""
    };

    if (
      (currentUser.id === data.receiver && activeChat.other_user_id === data.sender) ||
      activeChat.other_user_id === data.receiver
    ) {
      console.log("%c Msg Recived", "color: green; font-weight: bold;", data);
      setMessages((prevMessages) => [...prevMessages, newMsg]);

      if (data.receiver === currentUser.id) {
        fetch(`/api/websocket/set_readed?session_id=${data.session_id}`);
      }
    }

    return newMsg;
  }

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
                className={`${styles.message} ${isOwnMessage ? styles.ownMessage : ""}`}
              >
                <div className={styles.messageContent}>{message.content}</div>
                <div className={styles.messageTime}>
                  {isOwnMessage ? "You" : message.other_first_name || activeChat.other_first_name}{" "}
                  {formatTime(message.createdAt)}
                </div>
              </div>
            );
          })
        ) : (
          <div className={styles.emptyState}>No messages yet. Start the conversation!</div>
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
