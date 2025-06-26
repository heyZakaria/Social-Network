"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  useContext,
  useMemo,
} from "react";

const NotificationsContext = createContext();

export function NotificationsProvider({ user, children }) {
  const [notifications, setNotifications] = useState([]);
  const ws = useRef(null);
  const bc = useRef(null);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

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
      groupId: msg.Data.groupId || "",
      eventId: msg.Data.eventId || "",
    };

    setNotifications((prev) => {
      if (prev.some((n) => n.notifId === newNotif.notifId)) return prev;
      return [newNotif, ...prev].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    });
  };

  useEffect(() => {
    if (!user) return;

    bc.current = new BroadcastChannel("notifications_channel");

    bc.current.onmessage = (e) => {
      const msg = e.data;
      if (msg.Type === "notification") handleIncoming(msg);
      else if (msg.Type === "read_all") {
        setNotifications((prev) =>
          prev.map((n) => ({
            ...n,
            read: true,
          }))
        );
      }
    };

    const initWebSocket = async () => {
      try {
        const res = await fetch("/api/get-token", { credentials: "include" });
        const data = await res.json();
        const token = data?.data?.token;
        if (!token) return;

        const protocol = window.location.protocol === "https:" ? "wss" : "ws";
        const socket = new WebSocket(`${protocol}://${window.location.host}/api/websocket/ws?token=${token}`);

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
      ws.current?.close();
      bc.current?.close();
    };
  }, [user]);

  const markAsRead = async () => {
    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        read: true,
      }))
    );
    bc.current?.postMessage({ Type: "read_all" });

  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        setNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
