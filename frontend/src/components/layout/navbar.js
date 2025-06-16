"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { logoutUser } from "@/app/(auth)/_logout/logout";
import styles from "@/styles/navbar.module.css";
import notifStyles from "@/styles/notifications.module.css";
import Image from "next/image";
import {
  HiHome,
  HiMagnifyingGlass,
  HiCalendar,
  HiUsers,
  HiUserGroup,
  HiArrowRightOnRectangle,
  HiBell,
  HiChatBubbleOvalLeftEllipsis,
  HiChevronDown,
  HiBars3,
  HiUser,
  HiCog,
} from "react-icons/hi2";



export default function Navbar({ user }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const ws = useRef(null);

  useEffect(() => {
    if (!user) return;

    let socket;

    // Fetch the token for authentication
    fetch("/api/get-token", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (!data.data || !data.data.token) {
          console.error("Token not found in response:", data);
          return;
        }
        const token = data.data.token;
        console.log("WebSocket token:", token);


        // Use wss if your backend supports SSL, otherwise ws
        socket = new WebSocket(`ws://localhost:8080/ws?token=${token}`);
        ws.current = socket;

        socket.onopen = () => {
          // Optionally, you can send a handshake or log connection
          console.log("WebSocket connected");
        };

        socket.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            console.log("WebSocket message received:", msg.Data.type);

            if (msg.Type === "notification") {
              setNotifications(prev => [
                {
                  id: msg.Data.id,
                  type: msg.Data.type,
                  content: msg.Data.content,
                  from: msg.Data.from,
                  read: false,
                  createdAt: new Date().toISOString(),
                },
                ...prev,
              ]);
              setUnreadNotifications(prev => prev + 1);
            } else if (msg.Type === "private_message") {
              setUnreadMessages(prev => prev + 1);
              // Optionally, add to a messages array
            }
          } catch (err) {
            console.error("Error parsing WebSocket message:", err);
          }
        };

        socket.onerror = (err) => {
          console.error("WebSocket error", err);
        };

        socket.onclose = () => {
          console.log("WebSocket closed");
        };
      })
      .catch(err => {
        console.error("Failed to fetch token:", err);
      });

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [user]);


  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
    setUnreadNotifications(0);
  };

  const handleLogout = async () => {
    await logoutUser();
    window.location.href = "/login";
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

  const handleNotificationClick = (notificationId) => {
    // Mark notification as read
    setNotifications(
      notifications.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );

    // Update unread count
    setUnreadNotifications(Math.max(0, unreadNotifications - 1));

    // Close notifications panel
    setIsNotificationsOpen(false);

    // In a real app, you would navigate to the relevant page
    // For now, we'll just close the panel
  };

  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setIsNotificationsOpen(false);
    setIsMessagesOpen(false);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <div className={styles.navbarLogo}>
          <Link href="/" className={styles.logoLink} onClick={closeAllMenus}>
            <span className={styles.logoText}>ConnectHub</span>
          </Link>
        </div>

        <>
          <div className={styles.navbarCenter}>
            <Link
              href="/"
              className={`${styles.navLink} ${isActive("/") ? styles.active : ""
                }`}
              onClick={closeAllMenus}
            >
              <HiHome size={24} />
            </Link>
            <Link
              href="/friends"
              className={`${styles.navLink} ${isActive("/friends") ? styles.active : ""
                }`}
              onClick={closeAllMenus}
            >
              <HiUserGroup size={24} />
            </Link>
            <Link
              href="/groups"
              className={`${styles.navLink} ${isActive("/groups") ? styles.active : ""
                }`}
              onClick={closeAllMenus}
            >
              <HiUsers size={24} />
            </Link>
            <Link
              href="/events"
              className={`${styles.navLink} ${isActive("/events") ? styles.active : ""
                }`}
              onClick={closeAllMenus}
            >
              <HiCalendar size={24} />
            </Link>
          </div>

          <div className={styles.navbarRight}>
            <div className={styles.navbarSearch}>
              <input
                type="text"
                placeholder="Search..."
                className={styles.searchInput}
              />
              <button className={styles.searchButton}>
                <HiMagnifyingGlass size={16} />
              </button>
            </div>

            <div className={styles.navbarIcons}>
              <div className={styles.iconContainer}>
                <button
                  className={styles.iconButton}
                  onClick={() => {
                    setIsNotificationsOpen(!isNotificationsOpen);
                    setIsMessagesOpen(false);
                    setIsMenuOpen(false);
                    }}
                    >
                    <HiBell size={20} />
                    {unreadNotifications > 0 && (
                      <span className={styles.badge}>{unreadNotifications}</span>
                    )}
                    </button>
                    {isNotificationsOpen && (
                    <div className={`${styles.dropdown} ${notifStyles.notificationsContainer}`}>
                      <div className={styles.dropdownHeader}>
                      <h3>Notifications</h3>
                      <button
                      className={styles.markAllRead}
                      onClick={handleMarkAllAsRead}
                      >
                      Mark all as read
                      </button>
                      </div>
                      <div className={styles.dropdownContent}>
                      {notifications.length > 0 ? (
                      <ul className={notifStyles.notificationsContainer}>
                      {notifications.map((notification, idx) => {
                        // Choose icon based on notification type
                        let TypeIcon = null;
                        switch (notification.type) {
                        case "follow_request":
                          TypeIcon = HiUser;
                          break;
                        case "invite":
                          TypeIcon = HiUserGroup;
                          break;
                        case "group":
                          TypeIcon = HiUsers;
                          break;
                        case "accept":
                          TypeIcon = HiCheckCircle;
                          break;
                        case "message":
                          TypeIcon = HiChatBubbleOvalLeftEllipsis;
                          break;
                        default:
                          TypeIcon = HiBell;
                        }
                        return (
                        <li
                        key={`${notification.id}-${idx}`}
                        className={notification.read ? notifStyles.read : notifStyles.unread}
                        style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px 12px",
                        borderBottom: "1px solid #f0f0f0",
                        cursor: "pointer",
                        background: notification.read ? "#fafafa" : "#e6f7ff"
                        }}
                        >
                        <Link
                        href={`/profile/${notification.id || ""}`}
                        onClick={() => handleNotificationClick(notification.id)}
                        className={styles.notificationAvatarLink}
                        style={{ display: "flex", alignItems: "center", position: "relative" }}
                        >
                        <Image
                        width={45}
                        height={45}
                        src={notification.avatar || "/uploads/profile.jpeg"}
                        alt={notification.from || "User"}
                        className={styles.notificationAvatar}
                        style={{
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: notification.read ? "1px solid #ccc" : "2px solid #1677ff"
                        }}
                        />
                        {/* Notification type icon overlay */}
                        <span style={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          background: "#fff",
                          borderRadius: "50%",
                          boxShadow: "0 0 2px #aaa",
                          padding: "2px"
                        }}>
                          <TypeIcon size={18} color="#1677ff" />
                        </span>
                        </Link>
                        <div>
                        <p className={styles.notificationName}>
                        <Link
                          href={`/profile/${notification.id || ""}`}
                          onClick={() => handleNotificationClick(notification.id)}
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
                        </li>
                      )})}
                      </ul>
                      ) : (
                      <div className={styles.emptyState}>
                      <p>No notifications yet</p>
                      </div>
                      )}
                      </div>
                      <div className={styles.dropdownFooter}></div>
                    </div>
                    )}
                    </div>

                    <div className={styles.iconContainer}>
                    <button
                    className={styles.iconButton}
                    onClick={() => {
                    setIsMessagesOpen(!isMessagesOpen);
                    setIsNotificationsOpen(false);
                    setIsMenuOpen(false);
                  }}
                >
                  <HiChatBubbleOvalLeftEllipsis size={20} />
                  {unreadMessages > 0 && (
                    <span className={styles.badge}>{unreadMessages}</span>
                  )}
                </button>

                {isMessagesOpen && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                      <h3>Messages</h3>
                    </div>
                    <div className={styles.dropdownContent}>
                      <div className={`${styles.messageItem} ${styles.unread}`}>
                        <Image width={200} height={100}
                          src="/uploads/profile.jpeg"
                          alt="Jane Smith"
                          className={styles.messageAvatar}
                        />
                        <div className={styles.messageContent}>
                          <p className={styles.messageName}>Jane Smith</p>
                          <p className={styles.messageText}>
                            It's going great! I'll share some previews with you
                            soon.
                          </p>
                          <span className={styles.messageTime}>
                            2 hours ago
                          </span>
                        </div>
                      </div>
                      <div className={styles.messageItem}>
                        <Image width={200} height={100}
                          src="/uploads/profile.jpeg"
                          alt="Mike Johnson"
                          className={styles.messageAvatar}
                        />
                        <div className={styles.messageContent}>
                          <p className={styles.messageName}>Mike Johnson</p>
                          <p className={styles.messageText}>
                            Thanks for the feedback on my track!
                          </p>
                          <span className={styles.messageTime}>Yesterday</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.dropdownFooter}>
                      {/* <Link
                        href="/messages"
                        className={styles.viewAll}
                        onClick={closeAllMenus}
                      >
                        View all messages
                      </Link> */}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.userMenu}>
              <button
                className={styles.userButton}
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen);
                  setIsNotificationsOpen(false);
                  setIsMessagesOpen(false);
                }}
              >

                <Image width={200} height={100}
                  src={user.avatar || "/uploads/profile.jpeg"}
                  alt={user.firstName}
                  className={styles.userAvatar}
                />
                <span className={styles.userName}>{user.firstName}</span>
                <HiChevronDown size={16} />
              </button>

              {isMenuOpen && (
                <div className={styles.userDropdown}>
                  <Link
                    href={`/profile/${user.id}`}
                    className={styles.userDropdownItem}
                    onClick={closeAllMenus}
                  >
                    <HiUser size={16} />
                    My Profile
                  </Link>
                  <Link
                    href="/settings"
                    className={styles.userDropdownItem}
                    onClick={closeAllMenus}
                  >
                    <HiCog size={16} />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={styles.userDropdownItem}
                  >
                    <HiArrowRightOnRectangle size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>

            <button
              className={styles.mobileMenuButton}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <HiBars3 size={24} />
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className={styles.mobileMenu}>
              <Link
                href="/"
                className={styles.mobileMenuItem}
                onClick={closeAllMenus}
              >
                <HiHome size={20} />
                Home
              </Link>
              <Link
                href="/friends"
                className={styles.mobileMenuItem}
                onClick={closeAllMenus}
              >
                <HiUserGroup size={20} />
                Friends
              </Link>
              <Link
                href="/groups"
                className={styles.mobileMenuItem}
                onClick={closeAllMenus}
              >
                <HiUsers size={20} />
                Groups
              </Link>
              <Link
                href="/events"
                className={styles.mobileMenuItem}
                onClick={closeAllMenus}
              >
                <HiCalendar size={20} />
                Events
              </Link>
              <Link
                href="/profile"
                className={styles.mobileMenuItem}
                onClick={closeAllMenus}
              >
                <HiUser size={20} />
                Profile
              </Link>
              <Link
                href="/settings"
                className={styles.mobileMenuItem}
                onClick={closeAllMenus}
              >
                <HiCog size={20} />
                Settings
              </Link>
              <button onClick={handleLogout} className={styles.mobileMenuItem}>
                <HiArrowRightOnRectangle size={20} />
                Logout
              </button>
            </div>
          )}
        </>
      </div>
    </nav>
  );
}
