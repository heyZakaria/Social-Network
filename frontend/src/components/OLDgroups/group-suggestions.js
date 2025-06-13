"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "@/styles/components.module.css";

export default function GroupSuggestions({ suggestions = [] }) {
  const [currentSuggestions, setCurrentSuggestions] = useState(suggestions);

  const handleJoinRequest = (groupId) => {
    // In a real app, this would send an API request to join the group
    

    // Remove from suggestions after sending request
    setCurrentSuggestions(
      currentSuggestions.filter((group) => group.id !== groupId)
    );
  };

  const handleIgnore = (groupId) => {
    // Remove from suggestions
    setCurrentSuggestions(
      currentSuggestions.filter((group) => group.id !== groupId)
    );
  };

  if (currentSuggestions.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Suggested Groups</h3>
      <div className={styles.list}>
        {currentSuggestions.slice(0, 3).map((group) => (
          <div key={group.id} className={styles.item}>
            <Image width={} height={}
              src={group.image || "https://i.pravatar.cc/150?u=10`"}
              alt={group.title}
              className={styles.groupAvatar}
            />
            <div className={styles.info}>
              <div className={styles.name}>{group.title}</div>
              <div className={styles.groupMeta}>
                <span className={styles.memberCount}>
                  {group.memberCount}{" "}
                  {group.memberCount === 1 ? "member" : "members"}
                </span>
                <span className={styles.privacy}>
                  {/* {group.isPublic ? "Public" : "Private"} */}
                </span>
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
      {suggestions.length > 3 && (
        <Link href="/groups/discover" className={styles.seeAll}>
          See All Groups
        </Link>
      )}
    </div>
  );
}
