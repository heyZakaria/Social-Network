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

import { useNotifications } from "@/context/notifications-context";
import { formatDate, getNotificationIcon } from "@/lib/notifications-utils";
import NotificationItem from "@/components/notifications/notification-item";





export default function Navbar({ user }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const { notifications, unreadCount, markAsRead } = useNotifications();

  const handleLogout = async () => {
    await logoutUser();
    window.location.href = "/login";
  };

  const handleNotificationClick = (notificationId) => {
    markAsRead(notificationId);
    setIsNotificationsOpen(false);
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
                  {unreadCount > 0 && (
                    <span className={styles.badge}>{unreadCount}</span>
                  )}

                </button>
                {isNotificationsOpen && (
                  <div className={`${styles.dropdown} ${notifStyles.notificationsContainer}`}>
                    <div className={styles.dropdownHeader}>
                      <h3>Notifications</h3>
                    </div>
                    <div className={styles.dropdownContent}>
                      {notifications.length > 0 ? (
                        <>
                          <ul className={notifStyles.notificationsContainer}>
                            {notifications.slice(0, 3).map((n, idx) => (
                              <NotificationItem
                                key={idx}
                                notification={n}
                                onClick={handleNotificationClick}
                              />
                            ))}
                          </ul>
                          {notifications.length > 0 && (
                            <div className={styles.dropdownFooter}>
                              <Link href="/notifications" className={styles.viewAll}>
                                View all notifications
                              </Link>
                            </div>
                          )}
                        </>
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
