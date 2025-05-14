"use client"

import { useState } from "react"
import styles from "../../styles/profile.module.css"

export default function FollowButton({ currentUser, profileUser }) {
  const [isFollowing, setIsFollowing] = useState(profileUser.followers.includes(currentUser.id))
  const [isPending, setIsPending] = useState(false)

  const handleFollowAction = async () => {
    setIsPending(true)

    try {
      // In a real app, this would be an API call
      // For now, we'll simulate the behavior

      if (isFollowing) {
        // Unfollow
        console.log(`Unfollowing user ${profileUser.id}`)
        setIsFollowing(false)
      } else {
        // Follow or send follow request
        if (profileUser.isPublic) {
          console.log(`Following user ${profileUser.id}`)
          setIsFollowing(true)
        } else {
          console.log(`Sending follow request to user ${profileUser.id}`)
          // In a real app, we would show a "Requested" state
          // For simplicity, we'll just log it
        }
      }
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
