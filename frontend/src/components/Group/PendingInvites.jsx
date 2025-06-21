import useFetch from "@/hooks/useFetch"
import { useEffect, useState } from "react"
import Image from 'next/image'
import styles from './PendingInvites.module.css'

export default function PendingInviteList({ groupId }) {
  const [err, setError] = useState(null)
  const [invites, setInvites] = useState([])
  const { data, error, loading } = useFetch(`http://localhost:8080/api/groups/group/pending?group_id=${groupId}`)

  useEffect(() => {
    if (data) setInvites(data)
  }, [data])

  useEffect(() => {
    if (error) setError(error)
  }, [error])

  if (loading) return <p>Loading...</p>

  if (!invites || invites.length == 0)return <p>No Invites</p>
  return (
    <>
      <ul className={styles.inviteList}>
        {invites.map(invite => (
          <PendingInvite
            key={invite.invite_id}
            invite={invite}
            onInvite={(id) => {
              setInvites(prev => prev.filter(inv => inv.invite_id !== id))
            }}
          />
        ))}
      </ul>
      {err && <p className={styles.errorText}>{err}</p>}
    </>
  )
}

function PendingInvite({ invite, onInvite }) {
  const [actionError, setActionError] = useState(null)

  const handleInviteResponse = async (e) => {
    try {
      const respo = await fetch(`http://localhost:8080/api/groups/invite/approve?Action=${e.target.value}&Invite=${invite.invite_id}`, {
        credentials: 'include',
        method: "POST"
      })

      const res = await respo.json()
      if (!respo.ok || !res.success) throw new Error(res.message || "Failed to process this action")
      onInvite(invite.invite_id)
    } catch (error) {
      setActionError(error.message)
    }
  }

  return (
    <li className={styles.inviteCard}>
      <Image
        src={`/uploads/profile_images/${invite.avatar || "anon.png"}`}
        alt={`${invite.first_name} ${invite.last_name}` || "Img"}
        width={60}
        height={60}
        className={styles.avatar}
      />
      <div className={styles.inviteDetails}>
        <p className={styles.name}>{`${invite.first_name} ${invite.last_name}`}</p>
        {actionError && <p className={styles.errorText}>{actionError}</p>}
      </div>
      <div className={styles.actions}>
        <button value="accept" onClick={handleInviteResponse} className={styles.button}>Accept</button>
        <button value="reject" onClick={handleInviteResponse} className={styles.button}>Reject</button>
      </div>
    </li>
  )
}

export function RequestsToJoinGroup(){
    const [err, setError] = useState(null)
  const [invites, setInvites] = useState([])
  const { data, error, loading } = useFetch(`http://localhost:8080/api/groups/group/groupInvites`)
console.log("dataaaa", data);

  useEffect(() => {
    if (data) setInvites(data)
      
  }, [data])

  useEffect(() => {
    if (error) setError(error)
  }, [error])

  if (loading) return <p>Loading...</p>
      console.log("invvvvvvvvvvvvvvvvvvvv", invites);

  if (!invites || invites.length == 0)return <p>No Invites</p>
  return (
    <>
      <ul className={styles.inviteList}>
        {invites.map(invite => (
          <PendingRequest
            key={invite.invite_id}
            invite={invite}
            onInvite={(id) => {
              setInvites(prev => prev.filter(inv => inv.invite_id !== id))
            }}
          />
        ))}
      </ul>
      {err && <p className={styles.errorText}>{err}</p>}
    </>
  )
}

function PendingRequest(invite , onInvite){
    const [actionError, setActionError] = useState(null)

  const handleInviteResponse = async (e) => {
    try {
      const respo = await fetch(`http://localhost:8080/api/groups/group/inviteResponse?Action=${e.target.value}&Invite_id=${invite.invite.invite_id}`, {
        credentials: 'include',
        method: "POST"
      })

      const res = await respo.json()
      if (!respo.ok || !res.success) throw new Error(res.message || "Failed to process this action")
      onInvite(invite.invite.invite_id)
    } catch (error) {
      setActionError(error.message)
    }
  }

  console.log("+++++++++++++++++++++++++++++", invite.invite);
  

    return (
    <li className={styles.inviteCard}>
      <p></p>
      <Image
        src={`/uploads/profile_images/${invite.invite.avatar || "anon.png"}`}
        alt={`${invite.invite.first_name} ${invite.invite.last_name}` || "Img"}
        width={60}
        height={60}
        className={styles.avatar}
      />
      <div className={styles.inviteDetails}>
        <p className={styles.name}>{`${invite.invite.first_name} ${invite.invite.last_name} Invited you to join $ ${invite.invite.group_title}`}</p>
        {actionError && <p className={styles.errorText}>{actionError}</p>}
      </div>
      <div className={styles.actions}>
        <button value="accept" onClick={handleInviteResponse} className={styles.button}>Accept</button>
        <button value="reject" onClick={handleInviteResponse} className={styles.button}>Reject</button>
      </div>
    </li>
  )
}