'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/friends.module.css';
import FloatingChat from '@/components/chat/floating-chat';
import { useUser } from '@/context/user_context';
import FollowButton from '@/components/profile/follow-button';
import { useFriends } from '@/context/friends_context';
import Image from "next/image";

export default function FriendsPage() {
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState('suggestions');
  const {
    requests = [],
    suggestions = [],
    loading,
    handleAcceptRequest,
    handleRejectRequest,
    refetch,
  } = useFriends();

  const [handledRequests, setHandledRequests] = useState({});

  useEffect(() => {
    refetch();
  }, []);

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

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.friendsContainer}>
      <div className={styles.friendsHeader}>
        <h1>Friends</h1>
      </div>

      <div className={styles.friendsTabs}>
        {['requests', 'suggestions'].map((tab) => (
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
        {activeTab === 'requests' && (
          <div className={styles.friendsSection}>
            <h2 className={styles.sectionTitle}>Friend Requests</h2>
            <div className={styles.friendsGrid}>
              {requests.length > 0 ? (
                requests.map((friend) => (
                  <div key={friend.id} className={styles.friendCard}>
                    <Link href={`/profile/${friend.id}`}>
                      <Image width={200} height={100}
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
                    </div>
                    <div className={styles.friendActions}>
                      {handledRequests[friend.id] === 'accepted' ? (
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
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.noFriends}>No pending friend requests</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div className={styles.friendsSection}>
            <h2 className={styles.sectionTitle}>People You May Know</h2>
            <div className={styles.friendsGrid}>
              {suggestions.length > 0 ? (
                suggestions.map((suggestion) => (
                  <div key={suggestion.id} className={styles.friendCard}>
                    <Link href={`/profile/${suggestion.id}`}>
                      <Image width={200} height={100}
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
                ))
              ) : (
                <div className={styles.noFriends}>No suggestions at the moment</div>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}