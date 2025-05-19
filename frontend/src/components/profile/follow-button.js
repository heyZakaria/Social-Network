"use client"

import { useState } from "react"
import styles from "@/styles/profile.module.css"

export default function FollowButton({ currentUser, profileUser }) {
  const [isFollowing, setIsFollowing] = useState(
    currentUser.followers?.some(f => f.ID === currentUser.id)
  );
  const [isPending, setIsPending] = useState(false)

  const handleFollowAction = async () => {
    setIsPending(true)

    try {
      const response = await fetch(`/api/users/${profileUser.id}/${isFollowing ? 'unfollow' : 'follow'}`, {
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
      setIsFollowing(data.isFollowing);
    } catch (error) {
      console.error("Error following/unfollowing user:", error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <button
      className={`${styles.followButton} ${isFollowing ? styles.following : ""}`}
      onClick={handleFollowAction}
      disabled={isPending}
    >
      {isPending ? "Processing..." : isFollowing ? "Following" : "Follow"}
    </button>
  )
}