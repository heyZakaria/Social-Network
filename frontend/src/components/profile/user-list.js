'use client'
import { useUser } from "@/app/(utils)/user_context"
import styles from "../../styles/profile.module.css"
import { FaUserPlus, FaUserCheck, FaClock } from "react-icons/fa"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function UserList() {
  const { user: currentUser } = useUser()
  const [friends, setFriends] = useState([])
  const [loading, setLoading] = useState(true)
  const [followStates, setFollowStates] = useState({}) 

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch("/api/users/friends", { credentials: "include" })
        const data = await res.json()
        setFriends(data.data?.friends || [])
        setLoading(false)

        data.data?.friends.forEach(async (user) => {
          const res = await fetch(`/api/users/follow?id=${user.id}`, {
            method: "GET",
            credentials: "include",
          })
          const followData = await res.json()
          setFollowStates((prev) => ({
            ...prev,
            [user.id]: {
              isFollowing: followData.data.Data?.IsFollowing || false,
              requestPending: followData.data.Data?.RequestPending || false,
              loading: false,
            },
          }))
        })
      } catch (e) {
        console.error("Failed to load friends", e)
      }
    }

    fetchFriends()
  }, [])

  const handleFollow = async (userId) => {
    setFollowStates((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], loading: true },
    }))

    try {
      const res = await fetch(`/api/users/follow?id=${userId}`, {
        method: "POST",
        credentials: "include",
      })
      const data = await res.json()
      setFollowStates((prev) => ({
        ...prev,
        [userId]: {
          isFollowing: data.data.Data?.IsFollowing || false,
          requestPending: data.data.Data?.RequestPending || false,
          loading: false,
        },
      }))
    } catch (err) {
      console.error("Follow failed", err)
      setFollowStates((prev) => ({
        ...prev,
        [userId]: { ...prev[userId], loading: false },
      }))
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className={styles.userList}>
      {friends.map((user) => {
        if (user.id === currentUser.id) return null
        const follow = followStates[user.id] || {}
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
