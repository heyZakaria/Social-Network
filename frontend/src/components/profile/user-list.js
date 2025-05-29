'use client'

import styles from "../../styles/profile.module.css"
import Link from "next/link"
import FollowButton from "@/components/followButton"

export default function UserList({ type, users }) {
  if (!users || users.length === 0) {
    return <div className={styles.emptyState}>No {type} yet</div>;
  }
  return (
    <div className={styles.userList}>
      {users.map((user) => {
        return (
          <div key={user.id} className={styles.userItem}>
            <Link href={`/profile/${user.id}`} className={styles.userLink}>
              <img
                src={user.avatar || "/uploads/profile.jpeg"}
                alt={user.firstName}
                className={styles.userAvatar}
              />
              <div className={styles.userInfo}>
                <div className={styles.userName}>
                  {user.firstName} {user.lastName}
                  {user.nickName && (
                    <span className={styles.userNickname}>
                      ({user.nickName})
                    </span>
                  )}
                </div>
              </div>
            </Link>
            <div className={styles.userActions}>
              <FollowButton targetUserId={user.id} />
              <button className={styles.messageButton}>Message</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
