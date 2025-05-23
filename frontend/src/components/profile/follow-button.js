"use client"

import { useState, useEffect } from "react"
import styles from "@/styles/profile.module.css"
import { FaUserPlus, FaUserCheck, FaClock } from "react-icons/fa"

export default function FollowButton({ profileUser, currentUser }) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [requestPending, setRequestPending] = useState(false)
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    setIsFollowing(profileUser.followers?.some(f => f.ID === currentUser.id) || false)
    setRequestPending(profileUser.followRequests?.some(req => req.senderID === currentUser.id) || false)
  }, [profileUser.followers, profileUser.followRequests, currentUser.id])

  const handleFollowAction = async () => {
    setIsPending(true)

    try {
      const response = await fetch(`/api/users/follow?id=${profileUser.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })

      if (!response.ok) throw new Error("Failed to update follow status")

      const data = await response.json()

      setIsFollowing(data.data?.isFollowing || false)
      setRequestPending(data.data?.requestPending || false)

      console.log("Follow API response:", data)
    } catch (error) {
      console.error("Error following/unfollowing user:", error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <button
      className={`${styles.followButton} ${
        isFollowing ? styles.following : requestPending ? styles.pending : ""
      }`}
      onClick={handleFollowAction}
      disabled={isPending}
    >
      {isPending ? (
        "⏳ Processing..."
      ) : isFollowing ? (
        <>
          <FaUserCheck /> Following
        </>
      ) : requestPending ? (
        <>
          <FaClock /> Requested
        </>
      ) : (
        <>
          <FaUserPlus /> Follow
        </>
      )}
    </button>
  )
}
