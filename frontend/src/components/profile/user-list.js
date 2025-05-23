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
      if (user.ID !== currentUser.id) {
        const isFollowing = user.Followers?.some(f => f.ID === currentUser.id)
        const isPending = user.Followers?.some(f => f.ID === currentUser.id && f.follower_status === "pending")
        initialStatus[user.ID] = isFollowing ? "following" : isPending ? "pending" : "none"
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
        <div key={user.ID} className={styles.userItem}>
          <Link href={`/profile/${user.ID}`} className={styles.userLink}>
            <img src={user.Avatar || "/default-avatar.png"} alt={user.FirstName} className={styles.userAvatar} />
            <div className={styles.userInfo}>
              <div className={styles.userName}>
                {user.FirstName} {user.LastName}
                {user.NickName && <span className={styles.userNickname}>({user.NickName})</span>}
              </div>
            </div>
          </Link>

          {user.ID !== currentUser.id && (
            <button
              className={styles.followButton}
              onClick={() => handleFollow(user.ID)}
              disabled={pendingFollows[user.ID]}
            >
              {pendingFollows[user.ID]
                ? "Processing..."
                : followStatus[user.ID] === "following"
                ? "Following"
                : followStatus[user.ID] === "pending"
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
