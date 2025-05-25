"use client"

import { useState, useEffect } from "react"
import styles from "@/styles/profile.module.css"
import { FaUserPlus, FaUserCheck, FaClock } from "react-icons/fa"

export default function FollowButton({ profileUser, currentUser }) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [requestPending, setRequestPending] = useState(false)
  const [isPending, setIsPending] = useState(true)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleFollow = async (isInitialCheck = false) => {
    // Don't proceed if we're already pending and this is not an initial check
    if (isPending && !isInitialCheck) return

    setIsPending(true)
    try {
      const res = await fetch(`/api/users/follow?id=${profileUser.id}`, {
        method: "GET",
        credentials: "include",
      })

      if (!res.ok) throw new Error("Follow/unfollow failed")

      const data = await res.json()
      console.log("+++++++button",data);
      
      
      if (data.success) {
        setIsFollowing(data.data?.isFollowing || false)
        setRequestPending(data.data?.requestPending || false)
      }
    } catch (err) {
      console.error("Error in follow operation:", err)
    } finally {
      setIsPending(false)
      setShowConfirm(false)
    }
  }

  // Initial status check
  useEffect(() => {
    if (currentUser?.id && profileUser?.id) {
      handleFollow(true)
    }
  }, [profileUser?.id, currentUser?.id])

  const handleClick = () => {
    if (isFollowing) {
      setShowConfirm(true)
    } else {
      handleFollow()
    }
  }

  return (
    <>
      <button
        className={`${styles.followButton} ${
          isFollowing ? styles.following : requestPending ? styles.pending : ""
        }`}
        onClick={handleClick}
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

      {showConfirm && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <p>Are you sure you want to unfollow this user?</p>
            <div className={styles.popupButtons}>
              <button onClick={() => handleFollow()} className={styles.confirmBtn}>Yes</button>
              <button onClick={() => setShowConfirm(false)} className={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
