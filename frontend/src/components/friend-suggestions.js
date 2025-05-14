"use client"

import { useState } from "react"
import Link from "next/link"
import styles from "@/styles/components.module.css"

export default function FriendSuggestions({ suggestions = [] }) {
  const [currentSuggestions, setCurrentSuggestions] = useState(suggestions)

  const handleSendRequest = (userId) => {
    // In a real app, this would send an API request to send a friend request
    console.log(`Sending friend request to user ${userId}`)

    // Remove from suggestions after sending request
    setCurrentSuggestions(currentSuggestions.filter((user) => user.id !== userId))
  }

  const handleIgnore = (userId) => {
    // Remove from suggestions
    setCurrentSuggestions(currentSuggestions.filter((user) => user.id !== userId))
  }

  if (currentSuggestions.length === 0) {
    return null
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>People You May Know</h3>
      <div className={styles.list}>
        {currentSuggestions.slice(0, 5).map((user) => (
          <div key={user.id} className={styles.item}>
            <img
              src={user.avatar || "/placeholder.svg?height=40&width=40"}
              alt={user.firstName}
              className={styles.avatar}
            />
            <div className={styles.info}>
              <div className={styles.name}>
                {user.firstName} {user.lastName}
              </div>
              {user.mutualFriends > 0 && (
                <div className={styles.meta}>
                  {user.mutualFriends} mutual {user.mutualFriends === 1 ? "friend" : "friends"}
                </div>
              )}
            </div>
            <div className={styles.actions}>
              <button className={`${styles.button} ${styles.primaryButton}`} onClick={() => handleSendRequest(user.id)}>
                Follow
              </button>
              <button className={`${styles.button} ${styles.secondaryButton}`} onClick={() => handleIgnore(user.id)}>
                Ignore
              </button>
            </div>
          </div>
        ))}
      </div>
      {suggestions.length > 5 && (
        <Link href="/suggestions" className={styles.seeAll}>
          See All Suggestions
        </Link>
      )}
    </div>
  )
}
