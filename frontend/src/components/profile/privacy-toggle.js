"use client"

import { useState } from "react"
import styles from "@/styles/profile.module.css"
import { fetchWithAuth } from "@/app/(utils)/api"

export default function PrivacyToggle({ user }) {
  console.log("==============user============");
  console.log(user)
  console.log("==========================");
  
  const [isPublic, setIsPublic] = useState(user.isPublic)
  const [isPending, setIsPending] = useState(false)

  const handlePrivacyToggle = async () => {
    setIsPending(true)

    try {
      const response = await fetchWithAuth(`/api/users/privacy`, {
        method: 'PUT',
        body: JSON.stringify({ isPublic: !isPublic })
      });

      if (!response || !response.ok) {
        throw new Error('Failed to update privacy settings');
      }

      const data = await response.json();
      setIsPublic(data.isPublic);
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
