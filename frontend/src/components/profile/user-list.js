"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import styles from "../../styles/profile.module.css"

export default function UserList({ users, currentUser }) {
  const [displayCount, setDisplayCount] = useState(5)
  const [followStatus, setFollowStatus] = useState({})
  const [pendingFollows, setPendingFollows] = useState({})

  useEffect(() => {
    const initialStatus = {}
    users.forEach(user => {
      if (user.id !== currentUser.id) {
        const isFollowing = user.Followers?.some(f => f.id === currentUser.id)
        const isPending = user.Followers?.some(f => f.id === currentUser.id && f.follower_status === "pending")
        initialStatus[user.id] = isFollowing ? "following" : isPending ? "pending" : "none"
      }
    })
    setFollowStatus(initialStatus)
  }, [users, currentUser.id])

  const handleFollow = async (userId) => {
    setPendingFollows(prev => ({ ...prev, [userId]: true }))
    try {
      const res = await fetch(`/api/users/follow?id=${userId}`, {
        method: "POST", credentials: "include"
      })
      const data = await res.json()

      const status = data.data?.isFollowing
        ? "following"
        : data.data?.requestPending
        ? "pending"
        : "none"

      setFollowStatus(prev => ({ ...prev, [userId]: status }))
    } catch (err) {
      console.error("Follow error:", err)
    } finally {
      setPendingFollows(prev => ({ ...prev, [userId]: false }))
    }
  }

  const handleViewMore = () => setDisplayCount(prev => prev + 5)
  const handleViewLess = () => setDisplayCount(5)

  return (
    <div className={styles.userList}>
      {users.slice(0, displayCount).map((user) => (
        <div key={user.id} className={styles.userItem}>
          <Link href={`/profile/${user.id}`} className={styles.userLink}>
            <img src={user.avatar || "/uploads/profile.jpeg"} alt={user.firstName} className={styles.userAvatar} />
            <div className={styles.userInfo}>
              <div className={styles.userName}>
                {user.firstName} {user.lastName}
                {user.nickName && <span className={styles.userNickname}>({user.nickName})</span>}
              </div>
            </div>
          </Link>

          {user.id !== currentUser.id && (
            <button
              className={styles.followButton}
              onClick={() => handleFollow(user.id)}
              disabled={pendingFollows[user.id]}
            >
              {pendingFollows[user.id]
                ? "Processing..."
                : followStatus[user.id] === "following"
                ? "Following"
                : followStatus[user.id] === "pending"
                ? "Requested"
                : "Follow"}
            </button>
          )}
        </div>
      ))}

      {users.length > displayCount && (
        <div className={styles.viewMoreContainer}>
          <button className={styles.viewMoreButton} onClick={handleViewMore}>
            View more ({users.length - displayCount} remaining)
          </button>
        </div>
      )}

      {displayCount > 5 && (
        <div className={styles.viewMoreContainer}>
          <button className={styles.viewMoreButton} onClick={handleViewLess}>
            View less
          </button>
        </div>
      )}
    </div>
  )
}
