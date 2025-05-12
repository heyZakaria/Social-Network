"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { logoutUser } from "@/app/actions/auth";
import styles from "@/styles/navbar.module.css";
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
  const path = usePathname();

  const reg = /^\/profile\/\d+$/;
  if (
    !path ||
    !(
      reg.test(path) ||
      path === "/home" ||
      path === "/events" ||
      path === "/groups" ||
      path === "/friends" ||
      path === "/notifications"
    )
  ) {
    return null;
  }
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);


  useEffect(() => {
    // In a real app, you would fetch these from an API
    if (user) {
      // Simulate fetching notifications
      setNotifications([
        {
          id: 1,
          type: "follow_request",
          content: "Sarah Williams sent you a follow request",
          createdAt: "2023-03-22T10:15:00Z",
          read: false,
        },
        {
          id: 2,
          type: "group_invitation",
          content: "Jane Smith invited you to join Photography Enthusiasts",
          createdAt: "2023-03-24T09:45:00Z",
          read: false,
        },
        {
          id: 3,
          type: "like",
          content: "Mike Johnson liked your post",
          createdAt: "2023-03-25T14:30:00Z",
          read: true,
        },
      ]);

      setUnreadNotifications(2);
      setUnreadMessages(1);
    }
  }, [user]);

  
  const handleLogout = async () => {
    await logoutUser();
    // The action will handle the redirect
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
          <Link href="/home" className={styles.logoLink} onClick={closeAllMenus}>
            <span className={styles.logoText}>ConnectHub</span>
          </Link>
        </div>

        <>
          <div className={styles.navbarCenter}>
            <Link
              href="/home"
              className={`${styles.navLink} ${
                isActive("/home") ? styles.active : ""
              }`}
              onClick={closeAllMenus}
            >
              <HiHome size={24} />
            </Link>
            <Link
              href="/friends"
              className={`${styles.navLink} ${
                isActive("/friends") ? styles.active : ""
              }`}
              onClick={closeAllMenus}
            >
              <HiUserGroup size={24} />
            </Link>
            <Link
              href="/groups"
              className={`${styles.navLink} ${
                isActive("/groups") ? styles.active : ""
              }`}
              onClick={closeAllMenus}
            >
              <HiUsers size={24} />
            </Link>
            <Link
              href="/events"
              className={`${styles.navLink} ${
                isActive("/events") ? styles.active : ""
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
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                      <h3>Notifications</h3>
                      <button className={styles.markAllRead}>
                        Mark all as read
                      </button>
                    </div>
                    <div className={styles.dropdownContent}>
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`${styles.notificationItem} ${
                              !notification.read ? styles.unread : ""
                            }`}
                            onClick={() =>
                              handleNotificationClick(notification.id)
                            }
                          >
                            <div className={styles.notificationContent}>
                              <p>{notification.content}</p>
                              <span className={styles.notificationTime}>
                                {formatDate(notification.createdAt)}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className={styles.emptyState}>
                          <p>No notifications yet</p>
                        </div>
                      )}
                    </div>
                    <div className={styles.dropdownFooter}>
                      {/* <Link
                        href="/notifications"
                        className={styles.viewAll}
                        onClick={closeAllMenus}
                      >
                        View all notifications
                      </Link> */}
                    </div>
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
                        <img
                          src="https://i.pravatar.cc/150?u=10"
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
                        <img
                          src="https://i.pravatar.cc/150?u=10"
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
              
                <img
                  src={user.avatar || "https://i.pravatar.cc/150?u=10"}
                  alt={user.firstName}
                  className={styles.userAvatar}
                />
                <span className={styles.userName}>{user.firstName}</span>
                <HiChevronDown size={16} />
              </button>

              {isMenuOpen && (
                <div className={styles.userDropdown}>
                  <Link
                    // href={`/profile/${user.id}`}
                    href="/profile/1"
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
