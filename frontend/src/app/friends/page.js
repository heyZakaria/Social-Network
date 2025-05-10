import { getCurrentUser } from "@/actions/auth";
import styles from "@/styles/friends.module.css";

// Sample friends data
const sampleFriends = [
  {
    id: 1,
    firstName: "Sarah",
    lastName: "Williams",
    isOnline: true,
    avatar: "https://i.pravatar.cc/150?u=10`",
  },
  {
    id: 2,
    firstName: "David",
    lastName: "Brown",
    isOnline: false,
    lastActive: "2 hours ago",
    avatar: "https://i.pravatar.cc/150?u=10`",
  },
  {
    id: 3,
    firstName: "Emily",
    lastName: "Davis",
    isOnline: true,
    avatar: "https://i.pravatar.cc/150?u=10`",
  },
  {
    id: 4,
    firstName: "Michael",
    lastName: "Wilson",
    isOnline: false,
    lastActive: "1 day ago",
    avatar: "https://i.pravatar.cc/150?u=10`",
  },
  {
    id: 5,
    firstName: "Jessica",
    lastName: "Taylor",
    isOnline: true,
    avatar: "https://i.pravatar.cc/150?u=10`",
  },
];

// Sample friend suggestions
const sampleFriendSuggestions = [
  {
    id: 6,
    firstName: "John",
    lastName: "Doe",
    mutualFriends: 5,
    avatar: "https://i.pravatar.cc/150?u=10`",
  },
  {
    id: 7,
    firstName: "Jane",
    lastName: "Smith",
    mutualFriends: 2,
    avatar: "https://i.pravatar.cc/150?u=10`",
  },
  {
    id: 8,
    firstName: "Mike",
    lastName: "Johnson",
    mutualFriends: 0,
    avatar: "https://i.pravatar.cc/150?u=10`",
  },
  {
    id: 9,
    firstName: "Lisa",
    lastName: "Anderson",
    mutualFriends: 3,
    avatar: "https://i.pravatar.cc/150?u=10`",
  },
  {
    id: 10,
    firstName: "Robert",
    lastName: "Martin",
    mutualFriends: 1,
    avatar: "https://i.pravatar.cc/150?u=10`",
  },
];

export default async function FriendsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null; // This should be handled by middleware
  }

  return (
    <div className={styles.friendsContainer}>
      <div className={styles.friendsHeader}>
        <h1>Friends</h1>
      </div>

      <div className={styles.friendsTabs}>
        <button className={`${styles.tabButton} ${styles.activeTab}`}>
          All Friends
        </button>
        <button className={styles.tabButton}>Online</button>
        <button className={styles.tabButton}>Requests</button>
      </div>

      <div className={styles.friendsContent}>
        <div className={styles.friendsSection}>
          <h2 className={styles.sectionTitle}>Your Friends</h2>
          <div className={styles.friendsGrid}>
            {sampleFriends.map((friend) => (
              <div key={friend.id} className={styles.friendCard}>
                <img
                  src={friend.avatar || "/placeholder.svg?height=80&width=80"}
                  alt={`${friend.firstName} ${friend.lastName}`}
                  className={styles.friendAvatar}
                />
                <div className={styles.friendInfo}>
                  <h3 className={styles.friendName}>
                    {friend.firstName} {friend.lastName}
                  </h3>
                  <p className={styles.friendStatus}>
                    {friend.isOnline ? (
                      <span className={styles.onlineStatus}>Online</span>
                    ) : (
                      <span className={styles.offlineStatus}>
                        Last active: {friend.lastActive}
                      </span>
                    )}
                  </p>
                </div>
                <div className={styles.friendActions}>
                  <button className={styles.messageButton}>Message</button>
                  <button className={styles.unfollowButton}>Unfollow</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.friendsSection}>
          <h2 className={styles.sectionTitle}>People You May Know</h2>
          <div className={styles.friendsGrid}>
            {sampleFriendSuggestions.map((suggestion) => (
              <div key={suggestion.id} className={styles.friendCard}>
                <img
                  src={
                    suggestion.avatar || "/placeholder.svg?height=80&width=80"
                  }
                  alt={`${suggestion.firstName} ${suggestion.lastName}`}
                  className={styles.friendAvatar}
                />
                <div className={styles.friendInfo}>
                  <h3 className={styles.friendName}>
                    {suggestion.firstName} {suggestion.lastName}
                  </h3>
                  {suggestion.mutualFriends > 0 && (
                    <p className={styles.mutualFriends}>
                      {suggestion.mutualFriends} mutual{" "}
                      {suggestion.mutualFriends === 1 ? "friend" : "friends"}
                    </p>
                  )}
                </div>
                <div className={styles.friendActions}>
                  <button className={styles.followButton}>Follow</button>
                  <button className={styles.ignoreButton}>Ignore</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
