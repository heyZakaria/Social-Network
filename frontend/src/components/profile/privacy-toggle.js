"use client"

import { useState } from "react"
import styles from "@/styles/profile.module.css"

export default function PrivacyToggle({ user }) {
  const [isPublic, setIsPublic] = useState(user.isPublic)
  const [isPending, setIsPending] = useState(false)

  const handlePrivacyToggle = async () => {
    setIsPending(true)

    try {
      // In a real app, this would be an API call
      // For now, we'll simulate the behavior
      console.log(`Setting profile privacy to ${!isPublic ? "public" : "private"}`)
      setIsPublic(!isPublic)
    } catch (error) {
      console.error("Error toggling privacy:", error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className={styles.privacyToggle}>
      <span className={styles.privacyLabel}>{isPublic ? "Public Account" : "Private Account"}</span>
      <label className={styles.switch}>
        <input type="checkbox" checked={isPublic} onChange={handlePrivacyToggle} disabled={isPending} />
        <span className={styles.slider}></span>
      </label>
    </div>
  )
}
