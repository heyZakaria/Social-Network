"use client";

import { NotificationsProvider } from "@/context/notifications-context";

export default function NotificationsWrapper({ children, user = null }) {
  return (
    <NotificationsProvider user={user}>
      {children}
    </NotificationsProvider>
  );
}
