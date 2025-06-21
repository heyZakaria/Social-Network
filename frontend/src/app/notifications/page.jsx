"use client"

import { useState, useEffect } from "react"
import { useNotifications } from "@/context/notifications-context"
import styles from "@/styles/notifications.module.css"
import NotificationItem from "@/components/notifications/notification-item"
import FloatingChat from '@/components/chat/floating-chat'
import { useUser } from '@/context/user_context'

export default function Page() {
  const { notifications, markAsRead } = useNotifications()
  const [isLoading, setIsLoading] = useState(true)
  const { user: currentUser } = useUser()

  console.log("Notifications++++++++++++++++:", notifications);
  
  useEffect(() => {
    if (notifications) setIsLoading(false)
  }, [notifications])

  const handleClick = async (id) => {
    try {
      await markAsRead(id)
    } catch (err) {
      console.error("Error marking as read:", err)
    }
  }

  if (isLoading) {
    return (
      <ul className={styles.notificationsContainer}>
        <li className={styles.loadingItem}>
          <p>Loading notifications...</p>
        </li>
      </ul>
    )
  }

  if (!Array.isArray(notifications) || notifications.length === 0) {
    return (
      <ul className={styles.notificationsContainer}>
        <li className={styles.loadingItem}>
          <p>No notifications yet</p>
        </li>
      </ul>
    )
  }

  return (
    <>
      <ul className={styles.notificationsContainer}>
        {notifications.map((n) => (
          <NotificationItem key={n.id} notification={n} onClick={handleClick} />
        ))}
      </ul>

      <FloatingChat currentUser={currentUser} />
    </>
  )
}
