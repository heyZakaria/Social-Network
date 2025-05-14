"use client"

import { useState } from "react"
import Link from "next/link"
import styles from "../../styles/profile.module.css"

export default function UserList({ users, currentUser }) {
  const [displayCount, setDisplayCount] = useState(5)
  const USERS_PER_PAGE = 5

  if (users.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No users to display</p>
      </div>
    )
  }

  const handleViewMore = () => {
    setDisplayCount(Math.min(displayCount + USERS_PER_PAGE, users.length))
  }

  const handleViewLess = () => {
    setDisplayCount(USERS_PER_PAGE)
  }

  return (
    <div className={styles.userList}>
      {users.slice(0, displayCount).map((user) => (
        <div key={user.id} className={styles.userItem}>
          <Link href={`/profile/${user.id}`} className={styles.userLink}>
            <img
              src={user.avatar || "/placeholder.svg?height=50&width=50"}
              alt={user.firstName}
              className={styles.userAvatar}
            />
            <div className={styles.userInfo}>
              <div className={styles.userName}>
                {user.firstName} {user.lastName}
                {user.nickname && <span className={styles.userNickname}>({user.nickname})</span>}
              </div>
              {user.aboutMe && <div className={styles.userBio}>{user.aboutMe}</div>}
            </div>
          </Link>

          {user.id !== currentUser.id && (
            <button className={styles.followButton}>
              {user.followers.includes(currentUser.id) ? "Following" : "Follow"}
            </button>
          )}
        </div>
      ))}

      {users.length > USERS_PER_PAGE && (
        <div className={styles.viewMoreContainer}>
          {displayCount < users.length ? (
            <button className={styles.viewMoreButton} onClick={handleViewMore}>
              View more ({users.length - displayCount} remaining)
            </button>
          ) : (
            <button className={styles.viewMoreButton} onClick={handleViewLess}>
              View less
            </button>
          )}
        </div>
      )}
    </div>
  )
}
