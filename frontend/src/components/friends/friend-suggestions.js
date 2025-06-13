"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import styles from "@/styles/components.module.css"
import { useFriends } from "@/context/friends_context" 
import FollowButton from '@/components/profile/follow-button'


export default function FriendSuggestions() {
  const { suggestions = [], refetch } = useFriends()
  const [currentSuggestions, setCurrentSuggestions] = useState([])

  useEffect(() => {
    refetch() // get latest suggestions
  }, [])

  useEffect(() => {
    setCurrentSuggestions(suggestions)
  }, [suggestions])

  const handleSendRequest = (userId) => {
    // TODO: call backend
    setCurrentSuggestions((prev) => prev.filter((user) => user.id !== userId))
  }

  const handleIgnore = (userId) => {
    setCurrentSuggestions((prev) => prev.filter((user) => user.id !== userId))
  }

  if (currentSuggestions.length === 0) return null

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>People You May Know</h3>
      <div className={styles.list}>
        {currentSuggestions.slice(0, 5).map((user) => (
          <div key={user.id} className={styles.item}>
              <Link href={"/profile" + `/${user.id}`} className={styles.item} key={user.id}>
              <Image width={} height={}
                src={user.avatar || "/uploads/profile.jpeg"}
                alt={`${user.firstName} ${user.lastName}`}
                className={styles.avatar}
              />
              </Link>

              <div className={styles.info}>
                <Link href={"/profile" + `/${user.id}`} className={styles.item} key={user.id}>
                <div className={styles.name}>
                  <span>{user.firstName} {user.lastName}</span>
                </div>
                </Link>

                <div className={styles.actions}>
                      <FollowButton targetUserId={user.id} />
                  {/* <button
                    className={`${styles.button} ${styles.secondaryButton}`}
                    onClick={() => handleIgnore(user.id)}
                  >
                    Ignore
                  </button> */}
                </div>
                {/* {user.mutualFriends > 0 && (
                  <div className={styles.meta}>
                    {user.mutualFriends} mutual {user.mutualFriends === 1 ? "friend" : "friends"}
                  </div>
                )} */}
              </div>

            </div>
        ))}
      </div>
      {currentSuggestions.length > 5 && (
        <Link href="/friends" className={styles.seeAll}>
          See All Suggestions
        </Link>
      )}
    </div>
  )
}
