import Link from "next/link";
import styles from "@/styles/components.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { TrimName } from "./group-suggestions";

// Assuming useFetch is a custom hook you’ve created somewhere.
// If not, you can replace this with fetch + useEffect manually.
import useFetch from "@/hooks/useFetch"; // Make sure this path is correct

export default function CurrentGroups() {
  const [groups, setGroups] = useState([]);
  const { data, loading, error } = useFetch("/api/groups/GET");

  useEffect(() => {
    if (data) {
      const mapped = data
        .filter(group => ["Member", "Admin"].includes(group.memberState))
        .map(group => ({
          id: group.id,
          title: group.title,
          description: group.description,
          image: group.covername ? `/api/images/groups_cover/${group.covername}` : "/uploads/profile.jpeg",
          JoiningState: group.memberState || "Join",
          Members: group.memberCount,
          PostCount: group.postCount ?? 0,
          EventsCount: group.eventsCount ?? 0,
          unreadCount: group.unreadCount ?? 0,
        }));

      setGroups(mapped.length > 3 ? mapped.slice(0,3) : mapped);
    }
  }, [data]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading groups: {error.message}</p>;
  }

  if (groups.length === 0) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>Your Groups</h3>
        <p>You haven&apos;t joined any groups yet.</p>
        <Link href="/groups" className={styles.seeAll}>
          Discover Groups
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Your Groups</h3>
      <div className={styles.list}>
        {groups.slice(0, 5).map((group) => (
          <Link href={`/groups/${group.id}`} key={group.id}>
            <div className={styles.item}>
              <Image
                width={200}
                height={100}
                src={group.image}
                alt={group.title}
                className={styles.groupAvatar}
              />
              <div className={styles.info}>
                <div className={styles.name}>{TrimName(group.title)}</div>
                {group.unreadCount > 0 && (
                  <div className={styles.meta}>
                    {group.unreadCount} new {group.unreadCount === 1 ? "post" : "posts"}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
      {groups.length > 5 && (
        <Link href="/groups" className={styles.seeAll}>
          See All Groups
        </Link>
      )}
    </div>
  );
}
