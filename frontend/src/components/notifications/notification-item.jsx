"use client"

import Image from "next/image"
import Link from "next/link"
import styles from "@/styles/notifications.module.css"
import { getNotificationIcon, formatDate, getActionButtons } from "./notifications-utils"
import { useFriends } from '@/context/friends_context';

export default function NotificationItem({ notification, onClick }) {
  const { handledRequests, accept, reject } = useFriends();
  return (
    <li
      className={`${styles.notificationItem} ${notification.read ? styles.read : styles.unread}`}
    >
      <Link
        href={`/profile/${notification.id || ""}`}
        onClick={() => onClick(notification.id)}
        className={styles.notificationAvatarLink}
      >
        <Image
          width={45}
          height={45}
          src={notification.avatar || "/uploads/profile.jpeg"}
          alt={notification.from || "User"}
          className={`${styles.notificationAvatar} ${notification.read ? styles.avatarRead : styles.avatarUnread}`}
        />
        <span className={styles.notificationIconWrapper}>
          {getNotificationIcon(notification.type, styles.notificationIcon)}
        </span>
      </Link>

      <div className={styles.notificationContent}>
        <p className={styles.notificationName}>
          <Link
            href={`/profile/${notification.id || ""}`}
            onClick={() => onClick(notification.id)}
            className={styles.notificationNameLink}
          >
            {notification.from || "User"}
          </Link>
        </p>
        <p className={styles.notificationText}>
          {notification.content || "You have a new notification"}
        </p>
        <span className={styles.notificationTime}>
          {formatDate(notification.createdAt)}
        </span>
      </div>
      
      {console.log("Notification:", notification)} 
      {getActionButtons(
        notification.type,
        notification.id,
        handledRequests,
        accept,
        reject,
        styles.notificationActions
      )}
    </li>
 )
}
