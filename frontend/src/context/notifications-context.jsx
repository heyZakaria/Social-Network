"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useUser } from "@/context/user_context";

const NotificationsContext = createContext();

export function NotificationsProvider({ user, children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ws = useRef(null);
  const bc = useRef(null);

  const handleIncoming = (msg) => {
    if (msg.Type !== "notification") return;

    const newNotif = {
      notifId: msg.Data.notifId,
      id: msg.Data.id,
      type: msg.Data.type,
      content: msg.Data.content,
      from: msg.Data.from,
      avatar: msg.Data.avatar,
      read: msg.Data.read ?? false,
      createdAt: msg.Data.createdAt,
      invitedId: msg.Data.invitedId || null,
    };

    setNotifications((prev) => {
      if (prev.some((n) => n.notifId === newNotif.notifId)) return prev;
      return [newNotif, ...prev].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    });

    if (!newNotif.read) setUnreadCount((c) => c + 1);
  };

  useEffect(() => {
    if (!user) return;

    // BroadcastChannel keeps tabs in sync
    bc.current = new BroadcastChannel("notifications_channel");
    bc.current.onmessage = (e) => handleIncoming(e.data);

    let socket;

    const initWebSocket = async () => {
      try {
        const res = await fetch("/api/get-token", { credentials: "include" });
        const data = await res.json();

        const token = data?.data?.token;
        if (!token) {
          console.warn("Token not found");
          return;
        }

        socket = new WebSocket(`ws://localhost:8080/ws?token=${token}`);
        ws.current = socket;

        socket.onmessage = (e) => {
          try {
            const msg = JSON.parse(e.data);
            if (msg.Type === "notification") {
              bc.current.postMessage(msg);
              handleIncoming(msg);
            }
          } catch (err) {
            console.error("WebSocket parse error:", err);
          }
        };

        socket.onerror = (err) => console.error("WebSocket error:", err);
        socket.onclose = () => console.log("WebSocket closed");
      } catch (err) {
        console.error("Failed to initialize WebSocket:", err);
      }
    };

    initWebSocket();

    return () => {
      if (socket) socket.close();
      if (bc.current) bc.current.close();
    };
  }, [user]);

  const markAsRead = async () => {
    try {
      const res = await fetch("/api/notifications/isread", {
        credentials: "include",
        method: "POST",
      });

      if (!res.ok) {
        console.error("Failed to mark notifications as read");
      }
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      
    } catch (err) {
      console.error("Error marking notifications as read:", err);
    }
  };

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, markAsRead, setNotifications }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
