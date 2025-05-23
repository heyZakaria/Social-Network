"use client"

import { useState } from "react"
import styles from "@/styles/profile.module.css"

export default function PrivacyToggle({ user }) {
  const [isPublic, setIsPublic] = useState(user.profile_status === "public")
  const [isPending, setIsPending] = useState(false)

  const handlePrivacyToggle = async () => {
    setIsPending(true)
    try {
      const newStatus = isPublic ? "private" : "public"

      const response = await fetch(`/api/users/privacy`, {
        method: 'PUT',
        body: JSON.stringify({ profile_status: newStatus }),
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) throw new Error('Failed to update privacy')

      const data = await response.json()

      setIsPublic(data.data.profile_status === "public")
    } catch (error) {
      console.error("Error privacy:", error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className={styles.privacyToggle}>
      <span className={styles.privacyLabel}>
        {isPublic ? `Public  Account` : "Private Account"}
      </span>
      <label className={styles.switch}>
        <input
          type="checkbox"
          checked={isPublic}
          onChange={handlePrivacyToggle}
          disabled={isPending}
        />
        <span className={styles.slider}></span>
      </label>
    </div>
  )
}
