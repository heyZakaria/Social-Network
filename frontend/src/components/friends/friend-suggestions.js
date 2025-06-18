"use client"

import Link from "next/link"
import { useFriends } from "@/context/friends_context" 
import FollowButton from '@/components/profile/follow-button'
import Image from "next/image"
import styles from "@/styles/components.module.css"

export default function FriendSuggestions() {
  const { suggestions = [] } = useFriends()

  if (!suggestions.length) return null

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>People You May Know</h3>
      <div className={styles.list}>
        {suggestions.slice(0, 5).map((user) => (
          <div key={user.id} className={styles.item}>
            <Link href={`/profile/${user.id}`}>
              <Image
                width={200}
                height={100}
                src={user.avatar || "/uploads/profile.jpeg"}
                alt={`${user.firstName} ${user.lastName}`}
                className={styles.avatar}
              />
            </Link>

            <div className={styles.info}>
              <Link href={`/profile/${user.id}`}>
                <div className={styles.name}>
                  <span>{user.firstName} {user.lastName}</span>
                </div>
              </Link>

              <div className={styles.actions}>
                <FollowButton targetUserId={user.id} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {suggestions.length > 5 && (
        <Link href="/friends" className={styles.seeAll}>
          See All Suggestions
        </Link>
      )}
    </div>
  )
}
