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
    console.log("Current User:", currentUser);


    useEffect(() => {
        if (notifications) setIsLoading(false)
    }, [notifications])

    const handleClick = (id) => markAsRead(id)

    if (isLoading) {
        return (
            <ul className={styles.notificationsContainer}>
                <li className={styles.loadingItem}>
                    <p>Loading notifications...</p>
                </li>
            </ul>
        )
    }

    if (!notifications.length) {
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
                {notifications.map((n, idx) => (
                    <NotificationItem key={idx} notification={n} onClick={handleClick} />
                ))}
            </ul>

            <FloatingChat currentUser={currentUser} />
        </>
    )
}
