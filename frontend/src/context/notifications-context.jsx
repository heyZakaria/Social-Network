"use client";
import { createContext, useContext, useEffect, useState, useRef } from "react";

const NotificationsContext = createContext();

export function NotificationsProvider({ user, children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ws = useRef(null);

  useEffect(() => {
    if (!user) return;

    let socket;

    fetch("/api/get-token", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        const token = data.data?.token;
        if (!token) return;

        socket = new WebSocket(`ws://localhost:8080/ws?token=${token}`);
        ws.current = socket;

        socket.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            if (msg.Type === "notification") {
              const newNotif = {
                id: msg.Data.id,
                type: msg.Data.type,
                content: msg.Data.content,
                from: msg.Data.from,
                avatar: msg.Data.avatar,
                read: false,
                createdAt: new Date().toISOString(),
              };
              setNotifications((prev) => [newNotif, ...prev]);
              setUnreadCount((prev) => prev + 1);
            }
          } catch (err) {
            console.error("WS Parse Error", err);
          }
        };
      });

    return () => {
      if (ws.current) ws.current.close();
    };
  }, [user]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
