'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/friends.module.css';
import FloatingChat from '@/components/chat/floating-chat';
import { useUser } from '@/context/user_context';
import FollowButton from '@/components/profile/follow-button';
import { useFriends } from '@/context/friends_context';

export default function FriendsPage() {
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState('all');
  const {
    friends = [],
    followers = [],
    following = [],
    suggestions = [],
    loading,
    refetch,
    requests = [],
    handleAcceptRequest,
    handleRejectRequest,
  } = useFriends();

  // If your context does NOT provide 'friends', compute mutuals here:
  // const friends = followers.filter(f =>
  //   following.some(fl => fl.id === f.id)
  // );

  const [handledRequests, setHandledRequests] = useState({}); // key = friend.id

  useEffect(() => {
    refetch();
  }, []);

  // UI feedback for accept/reject
  const handleAccept = async (id) => {
    setHandledRequests((prev) => ({ ...prev, [id]: 'accepted' }));
    await handleAcceptRequest(id);
    refetch();
  };

  const handleReject = async (id) => {
    setHandledRequests((prev) => ({ ...prev, [id]: 'rejected' }));
    await handleRejectRequest(id);
    refetch();
  };

  // Filtered lists for tabs
  const filteredFriends = (() => {
    if (activeTab === 'all') return friends;
    if (activeTab === 'online') return friends.filter(f => f.isOnline);
    if (activeTab === 'requests') return requests;
    return [];
  })();

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.friendsContainer}>
      <div className={styles.friendsHeader}>
        <h1>Friends</h1>
      </div>

      <div className={styles.friendsTabs}>
        {['all', 'online', 'requests'].map((tab) => (
          <button
            key={tab}
            className={`${styles.tabButton} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.friendsContent}>
        <div className={styles.friendsSection}>
          <h2 className={styles.sectionTitle}>
            {activeTab === 'all' && 'Your Friends'}
            {activeTab === 'online' && 'Online Friends'}
            {activeTab === 'requests' && 'Friend Requests'}
          </h2>

          <div className={styles.friendsGrid}>
            {filteredFriends.length > 0 ? (
              filteredFriends.map((friend) => (
                <div key={friend.id} className={styles.friendCard}>
                  <Link href={`/profile/${friend.id}`}>
                    <img
                      src={friend.avatar || "/uploads/profile.jpeg"}
                      alt={`${friend.firstName} ${friend.lastName}`}
                      className={styles.friendAvatar}
                    />
                  </Link>
                  <div className={styles.friendInfo}>
                    <h3 className={styles.friendName}>
                      <Link href={`/profile/${friend.id}`}>
                        {friend.firstName} {friend.lastName}
                      </Link>
                    </h3>
                    {friend.nickName && <p className={styles.friendNickname}>({friend.nickName})</p>}
                    {activeTab === 'online' && friend.isOnline && (
                      <p className={styles.onlineStatus}>Online</p>
                    )}
                  </div>
                  <div className={styles.friendActions}>
                    {activeTab === 'requests' ? (
                      handledRequests[friend.id] === 'accepted' ? (
                        <div className={styles.acceptedStatus}>Accepted</div>
                      ) : handledRequests[friend.id] === 'rejected' ? (
                        <div className={styles.rejectedStatus}>Rejected</div>
                      ) : (
                        <>
                          <button
                            className={`${styles.followButton} ${styles.acceptButton}`}
                            onClick={() => handleAccept(friend.id)}
                          >
                            Accept
                          </button>
                          <button
                            className={`${styles.ignoreButton} ${styles.rejectButton}`}
                            onClick={() => handleReject(friend.id)}
                          >
                            Reject
                          </button>
                        </>
                      )
                    ) : (
                      <>
                        {/* <button className={styles.messageButton}>Message</button> */}
                        <FollowButton targetUserId={friend.id} />
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noFriends}>
                {activeTab === 'all' && 'No friends yet'}
                {activeTab === 'online' && 'No friends online'}
                {activeTab === 'requests' && 'No pending friend requests'}
              </div>
            )}
          </div>
        </div>

        {activeTab === 'all' && suggestions.length > 0 && (
          <div className={styles.friendsSection}>
            <h2 className={styles.sectionTitle}>People You May Know</h2>
            <div className={styles.friendsGrid}>
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className={styles.friendCard}>
                  <Link href={`/profile/${suggestion.id}`}>
                    <img
                      src={suggestion.avatar || "/uploads/profile.jpeg"}
                      alt={`${suggestion.firstName} ${suggestion.lastName}`}
                      className={styles.friendAvatar}
                    />
                  </Link>
                  <div className={styles.friendInfo}>
                    <h3 className={styles.friendName}>
                      <Link href={`/profile/${suggestion.id}`}>
                        {suggestion.firstName} {suggestion.lastName}
                      </Link>
                    </h3>
                    {suggestion.nickName && (
                      <p className={styles.friendNickname}>({suggestion.nickName})</p>
                    )}
                  </div>
                  <div className={styles.friendActions}>
                    <FollowButton targetUserId={suggestion.id} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <FloatingChat currentUser={currentUser} />
    </div>
  );
}