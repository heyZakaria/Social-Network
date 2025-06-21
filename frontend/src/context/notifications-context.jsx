"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";

const NotificationsContext = createContext();

export function NotificationsProvider({ user, children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ws = useRef(null);
  const channel = useRef(null);
  const heartbeatInterval = useRef(null);

  // Helper to handle incoming notification
  const handleIncomingNotification = (msg) => {
    if (msg.Type !== "notification") return;

    const newNotif = {
      id: msg.Data.id,
      type: msg.Data.type,
      content: msg.Data.content,
      from: msg.Data.from,
      avatar: msg.Data.avatar,
      read: false,
      createdAt: new Date().toISOString(),
    };

    setNotifications((prev) => {
      const exists = prev.some(
        (n) =>
          n.id === newNotif.id &&
          n.type === newNotif.type &&
          n.content === newNotif.content
      );
      return exists ? prev : [newNotif, ...prev];
    });

    setUnreadCount((prev) => prev + 1);
  };

  useEffect(() => {
    if (!user) return;

    // 1. Setup BroadcastChannel
    channel.current = new BroadcastChannel("notifications_channel");
    channel.current.onmessage = (event) => handleIncomingNotification(event.data);

    // 2. Determine primary tab
    const lastPing = parseInt(localStorage.getItem("ws_active") || "0", 10);
    const now = Date.now();
    const isPrimaryTab = now - lastPing > 3000;

    if (isPrimaryTab) {
      localStorage.setItem("ws_active", now.toString());

      heartbeatInterval.current = setInterval(() => {
        localStorage.setItem("ws_active", Date.now().toString());
      }, 1000);

      // 3. Open WebSocket
      fetch("/api/get-token", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          const token = data.data?.token;
          if (!token) return;

          const socket = new WebSocket(`ws://localhost:8080/ws?token=${token}`);
          ws.current = socket;

          socket.onmessage = (event) => {
            try {
              const msg = JSON.parse(event.data);
              if (msg.Type === "notification") {
                channel.current.postMessage(msg); // Broadcast to other tabs
                handleIncomingNotification(msg);   // Handle locally
              }
            } catch (err) {
              console.error("WS Parse Error", err);
            }
          };

          socket.onclose = () => console.log("WebSocket closed");
          socket.onerror = (err) => console.error("WebSocket error:", err);
        });
    }

    // Cleanup
    return () => {
      ws.current?.close();
      channel.current?.close();
      clearInterval(heartbeatInterval.current);
    };
  }, [user]);

  const markAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
