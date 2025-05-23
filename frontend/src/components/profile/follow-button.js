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
    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/users/follow?id=${profileUser.id}`, {
          method: "GET",
          credentials: "include",
        })
        const data = await res.json()
        setIsFollowing(data.data?.isFollowing || false)
        setRequestPending(data.data?.requestPending || false)
      } catch (err) {
        console.error("Error fetching follow status:", err)
      } finally {
        setIsPending(false)
      }
    }

    if (currentUser?.id && profileUser?.id) fetchStatus()
  }, [profileUser.id, currentUser.id])

  const handleFollowAction = async () => {
    if (isFollowing) {
      setShowConfirm(true)
      return
    }

    await updateFollow()
  }

  const updateFollow = async () => {
    setIsPending(true)
    try {
      const res = await fetch(`/api/users/follow?id=${profileUser.id}`, {
        method: "POST",
        credentials: "include",
      })

      if (!res.ok) throw new Error("Follow/unfollow failed")

      const data = await res.json()
      setIsFollowing(data.data?.isFollowing || false)
      setRequestPending(data.data?.requestPending || false)
    } catch (err) {
      console.error("Error following/unfollowing:", err)
    } finally {
      setIsPending(false)
      setShowConfirm(false)
    }
  }

  return (
    <>
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

      {showConfirm && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <p>Are you sure you want to unfollow this user?</p>
            <div className={styles.popupButtons}>
              <button onClick={updateFollow} className={styles.confirmBtn}>Yes</button>
              <button onClick={() => setShowConfirm(false)} className={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
