import Link from "next/link";
import styles from "@/styles/components.module.css";

export default function CurrentGroups({ groups = [] }) {
  if (groups.length === 0) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>Your Groups</h3>
        <p>You haven't joined any groups yet.</p>
        <Link href="/groups/discover" className={styles.seeAll}>
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
              <Image width={} height={}
                src={group.image || "https://i.pravatar.cc/150?u=10`"}
                alt={group.title}
                className={styles.groupAvatar}
              />
              <div className={styles.info}>
                <div className={styles.name}>{group.title}</div>
                {group.unreadCount > 0 && (
                  <div className={styles.meta}>
                    {group.unreadCount} new{" "}
                    {group.unreadCount === 1 ? "post" : "posts"}
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
