"use client"

import { useState, useEffect } from "react"
import { HiUser, HiUsers, HiCalendar, HiBell } from "react-icons/hi2"
import styles from "@/styles/notifications.module.css"

export default function NotificationsComponent({ currentUser }) {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setTimeout(() => {
                    const mockNotifications = [
                        {
                            id: 1,
                            type: "follow_request",
                            content: "Sarah Williams sent you a follow request",
                            relatedId: 1,
                            read: false,
                            createdAt: "2023-03-22T10:15:00Z",
                        },
                        {
                            id: 2,
                            type: "follow_request",
                            content: "Alex Brown sent you a follow request",
                            relatedId: 2,
                            read: false,
                            createdAt: "2023-03-23T14:30:00Z",
                        },
                        {
                            id: 3,
                            type: "group_invitation",
                            content: "Jane Smith invited you to join Photography Enthusiasts",
                            relatedId: 1,
                            read: false,
                            createdAt: "2023-03-24T09:45:00Z",
                        },
                        {
                            id: 4,
                            type: "group_request",
                            content: "Alex Brown requested to join Music Producers",
                            relatedId: 2,
                            read: false,
                            createdAt: "2023-03-25T11:20:00Z",
                        },
                        {
                            id: 5,
                            type: "group_event",
                            content: "New event in Hiking Adventures: Weekend Hike",
                            relatedId: 2,
                            read: true,
                            createdAt: "2023-03-25T16:45:00Z",
                        },
                        {
                            id: 6,
                            type: "group_event",
                            content: "New event in Photography Enthusiasts: Photography Workshop",
                            relatedId: 1,
                            read: true,
                            createdAt: "2023-03-20T11:30:00Z",
                        },
                    ];

                    setNotifications(mockNotifications);
                    setIsLoading(false);
                }, 1000);
            } catch (error) {
                console.error("Error fetching notifications:", error);
                setIsLoading(false);
            }
        };
        fetchNotifications();
    }, [currentUser.id]);

    const handleMarkAllAsRead = () => {
        setNotifications((prevNotifications) =>
            prevNotifications.map((notif) => ({ ...notif, read: true }))
        );
    };

    const handleNotificationAction = (notificationId, action) => {
        
        setNotifications((prevNotifications) =>
            prevNotifications.filter((notif) => notif.id !== notificationId)
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) {
            return "just now";
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} ${days === 1 ? "day" : "days"} ago`;
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case "follow_request":
                return <HiUser className={styles.notificationIcon} />;
            case "group_invitation":
                return <HiUsers className={styles.notificationIcon} />;
            case "group_request":
                return <HiUsers className={styles.notificationIcon} />;
            case "group_event":
                return <HiCalendar className={styles.notificationIcon} />;
            default:
                return <HiBell className={styles.notificationIcon} />;
        }
    };

    return (
        <div className={styles.notificationsContainer}>
            {isLoading ? (
                <p>Loading notifications...</p>
            ) : (
                <>
                    <button onClick={handleMarkAllAsRead}>Mark all as read</button>
                    <ul>
                        {notifications.map((notification) => (
                            <li
                                key={notification.id}
                                className={notification.read ? styles.read : styles.unread}
                            >
                                {getNotificationIcon(notification.type)}
                                <div>
                                    <p>{notification.content}</p>
                                    <small>{formatDate(notification.createdAt)}</small>
                                    <button
                                        onClick={() =>
                                            handleNotificationAction(notification.id, "dismiss")
                                        }
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}
