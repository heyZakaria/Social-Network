import Link from "next/link";
import styles from "@/styles/components.module.css";

export default function FriendsList({
  friends = [],
  title = "Friends",
  showOnlineStatus = true,
}) {
  if (friends.length === 0) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>{title}</h3>
        <p>No friends to display.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.list}>
        {friends.slice(0, 5).map((friend) => (
          <Link href={`/profile/${friend.id}`} key={friend.id}>
            <div className={styles.item}>
              <div style={{ position: "relative" }}>
                <img
                  src={friend.avatar || "https://i.pravatar.cc/150?u=10`"}
                  alt={friend.firstName}
                  className={styles.avatar}
                />
                {showOnlineStatus && friend.isOnline && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#4CAF50",
                      border: "2px solid white",
                      margin: "11px 12px",
                    }}
                  />
                )}
              </div>
              <div className={styles.info}>
                <div className={styles.name}>
                  {friend.firstName} {friend.lastName}
                </div>
                {friend.lastActive && !friend.isOnline && (
                  <div className={styles.meta}>
                    Last active: {friend.lastActive}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
      {friends.length > 5 && (
        <Link href="/friends" className={styles.seeAll}>
          See All Friends
        </Link>
      )}
    </div>
  );
}
