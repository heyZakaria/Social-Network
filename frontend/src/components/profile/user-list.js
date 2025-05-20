"use client"

import { useState } from "react"
import Link from "next/link"
import styles from "../../styles/profile.module.css"

export default function UserList({ users, currentUser }) {
  const [displayCount, setDisplayCount] = useState(5)
  const [followStatus, setFollowStatus] = useState(
    Object.fromEntries(users.map(user => [
      user.ID,
      user.Followers?.some(f => f.ID === currentUser.id) || false
    ]))
  );
  const [pendingFollows, setPendingFollows] = useState({})
  const USERS_PER_PAGE = 5

  const handleFollow = async (userId) => {
    setPendingFollows(prev => ({ ...prev, [userId]: true }))
    
    try {
      const isFollowing = followStatus[userId];
      const response = await fetch(`http://localhost:8080/api/users/${userId}/${isFollowing ? 'unfollow' : 'follow'}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1]}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to update follow status');
      }

      const data = await response.json();
      setFollowStatus(prev => ({ ...prev, [userId]: data.isFollowing }))
    } catch (error) {
      console.error("Error updating follow status:", error)
    } finally {
      setPendingFollows(prev => ({ ...prev, [userId]: false }))
    }
  }

  return (
    <div className={styles.userList}>
      {users.slice(0, displayCount).map((user) => (
        <div key={user.ID} className={styles.userItem}>
          <Link href={`/profile/${user.ID}`} className={styles.userLink}>
            <img
              src={user.Avatar || "/default-avatar.png"}
              alt={user.FirstName}
              className={styles.userAvatar}
            />
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
                : followStatus[user.ID]
                  ? "Following" 
                  : "Follow"}
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
