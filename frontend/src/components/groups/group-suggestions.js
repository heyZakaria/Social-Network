"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/styles/components.module.css";
import Image from "next/image";
import useFetch from "@/hooks/useFetch"; // Ensure this hook exists

export default function GroupSuggestions() {
  const [currentSuggestions, setCurrentSuggestions] = useState([]);
<<<<<<< HEAD
  const { data, loading, error } = useFetch("/api/groups/");
=======
  const { data, loading, error } = useFetch("/api/groups/GET");
>>>>>>> 47edb1f (Fixing Group Errors)

  useEffect(() => {
   
    if (data) {
      const mapped = data
        .filter(group => !["Member", "Admin"].includes(group.memberState))
        .map(group => ({
          id: group.id,
          title: group.title,
          description: group.description,
          image: group.covername ? `/uploads/${group.covername}` : "/uploads/profile.jpeg",
          JoiningState: group.memberState || "Join",
          Members: group.memberCount,
          PostCount: group.postCount ?? 0,
          EventsCount: group.eventsCount ?? 0,
          unreadCount: group.unreadCount ?? 0,
        }));

      setCurrentSuggestions(mapped.slice(0, 3));
    }
  }, [data]);

  const handleJoinRequest = (groupId) => {
    // TODO: send actual join request API call here

    // Optimistically update UI
    setCurrentSuggestions(prev =>
      prev.filter((group) => group.id !== groupId)
    );
  };

  const handleIgnore = (groupId) => {
    setCurrentSuggestions(prev =>
      prev.filter((group) => group.id !== groupId)
    );
  };

  if (loading) return <p>Loading suggestions...</p>;
  if (error) return <p>Failed to load suggestions: {error.message}</p>;
  if (currentSuggestions.length === 0) return null;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Suggested Groups</h3>
      <div className={styles.list}>
        {currentSuggestions.map((group) => (
          <div key={group.id} className={styles.item}>
            <Image
              width={200}
              height={100}
              src={group.image}
              alt={group.title}
              className={styles.groupAvatar}
            />
            <div className={styles.info}>
              <div className={styles.name}>{TrimName(group.title)}</div>
              <div className={styles.groupMeta}>
                <span className={styles.memberCount}>
                  {group.Members} {group.Members === 1 ? "member" : "members"}
                </span>
                {/* <span className={styles.privacy}>Public/Private</span> */}
              </div>
            </div>
            <div className={styles.actions}>
              <button
                className={`${styles.button} ${styles.primaryButton}`}
                onClick={() => handleJoinRequest(group.id)}
              >
                Join
              </button>
              <button
                className={`${styles.button} ${styles.secondaryButton}`}
                onClick={() => handleIgnore(group.id)}
              >
                Ignore
              </button>
            </div>
          </div>
        ))}
      </div>
      {data?.length > 3 && (
        <Link href="/groups/discover" className={styles.seeAll}>
          See All Groups
        </Link>
      )}
    </div>
  );
}


export function TrimName(Name){
  return (
    Name.length > 7 ? `${Name.slice(0,6)}...` : Name 
  )
}