'use client'

import { useUser } from "@/app/(utils)/user_context"
import styles from "../../styles/profile.module.css"
import Link from "next/link"
import { useEffect, useState } from "react"
import FollowButton from "@/components/followButton"
import { useParams } from 'next/navigation';

export default function UserList(params) {
  const { user: currentUser } = useUser()
  const [friends, setFriends] = useState([])
  const [loading, setLoading] = useState(true)

    const paramsx = useParams();
    const ids = paramsx.id

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch(`/api/users/friends?id=${ids}`, { credentials: "include" })
        const data = await res.json()
        console.log("Friends data:", data);
        
        setFriends(data.data?.friends || [])
      } catch (e) {
        console.error("Failed to load friends", e)
      } finally {
        setLoading(false)
      }
    }

    fetchFriends()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div className={styles.userList}>
      {friends.map((user) => {
        if (user.id === currentUser.id) return null
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
