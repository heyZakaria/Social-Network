"use client"

import { useState, useEffect } from "react"
import styles from "@/styles/profile.module.css"
import { FaUserPlus, FaUserCheck, FaClock } from "react-icons/fa"

export default function FollowButton({ profileUser, currentUser }) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [requestPending, setRequestPending] = useState(false)
  const [isPending, setIsPending] = useState(true)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const res = await fetch(`/api/users/follow?id=${profileUser.id}`, {
          method: "GET",
          credentials: "include",
        })
        if (!res.ok) throw new Error("Failed to fetch follow status")
        const data = await res.json()
      console.log("+++++", data.data.Data);
      
        setIsFollowing(data.data.Data?.IsFollowing || false)
        setRequestPending(data.data.Data?.RequestPending || false)
      } catch (err) {
        console.error("Error checking follow status:", err)
      } finally {
        setIsPending(false)
      }
    }

    if (currentUser?.id && profileUser?.id) {
      checkFollowStatus()
    }
  }, [profileUser?.id, currentUser?.id])

  const handleFollow = async () => {
    setIsPending(true)
    try {
      const res = await fetch(`/api/users/follow?id=${profileUser.id}`, {
        method: "POST",
        credentials: "include",
      })
      if (!res.ok) throw new Error("Follow/unfollow failed")
      const data = await res.json()
          console.log("+--------", data);
      setIsFollowing(data.data.Data?.IsFollowing || false)
      setRequestPending(data.data.Data?.RequestPending || false)
    } catch (err) {
      console.error("Error in follow operation:", err)
    } finally {
      setIsPending(false)
      setShowConfirm(false)
    }
  }

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
              <button onClick={handleFollow} className={styles.confirmBtn}>Yes</button>
              <button onClick={() => setShowConfirm(false)} className={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
