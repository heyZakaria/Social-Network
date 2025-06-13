'use client'

import styles from "@/styles/profile.module.css"
import Link from "next/link"
import FollowButton from "@/components/profile/follow-button"
import { useUser } from '@/context/user_context';


export default function UserList({ type, users }) {
  const { user: currentUser } = useUser();
  if (!users || users.length === 0) {
    return <div className={styles.emptyState}>No {type} yet</div>;
  }
  if (!currentUser) {
    return null;
  }
  console.log("UserList: users", users);
  
  return (
    <div className={styles.userList}>
      {users.map((user) => {
        return (
          <div key={user.id} className={styles.userItem}>
            <Link href={`/profile/${user.id}`} className={styles.userLink}>
              <Image width={} height={}
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
              {currentUser && user.id !== currentUser.id && (
                <FollowButton targetUserId={user.id} />
              )}
              {/* <button className={styles.messageButton}>Message</button> */}
            </div>
          </div>
        )
      })}
    </div>
  )
}
