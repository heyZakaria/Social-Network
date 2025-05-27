'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/friends.module.css';
import FloatingChat from '@/components/chat/floating-chat';
import { useUser } from '@/app/(utils)/user_context';
import FollowButton from '@/components/followButton';

export default function FriendsPage() {
  const { currentUser } = useUser();
  const [friends, setFriends] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFriends() {
      try {
        const res = await fetch('http://localhost:8080/api/users/friends', {
          credentials: 'include',
        });
        const data = await res.json();
        // Always use arrays, never null
        const friendsArr = Array.isArray(data?.data?.friends) ? data.data.friends : [];
        const requestsArr = Array.isArray(data?.data?.requests) ? data.data.requests : [];

        setFriends([
          ...friendsArr.map((u) => ({
            ID: u.id,
            FirstName: u.firstName,
            LastName: u.lastName,
            NickName: u.nickname,
            Avatar: u.avatar,
            follower_status: 'accepted',
            isOnline: u.isOnline || false,
          })),
          ...requestsArr.map((u) => ({
            ID: u.id,
            FirstName: u.firstName,
            LastName: u.lastName,
            NickName: u.nickname,
            Avatar: u.avatar,
            follower_status: 'pending',
            isOnline: u.isOnline || false,
          })),
        ]);

        const suggestionsRes = await fetch('/api/users/suggestions', {
          credentials: 'include',
        });
        const suggestionsData = await suggestionsRes.json();
        console.log('Suggestions data:', suggestionsData);

        setSuggestions(
          (suggestionsData.data?.users || []).map((u) => ({
            ID: u.id,
            FirstName: u.firstName,
            LastName: u.lastName,
            NickName: u.nickname,
            Avatar: u.avatar,
          }))
        );
      } catch (err) {
        console.error('Failed to load friends:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchFriends();
  }, []);

  const handleFollow = async (id) => {
    // TODO: implement follow
  };

  const handleUnfollow = async (id) => {
    // TODO: implement unfollow
  };

  const handleAcceptRequest = async (id) => {
    // TODO: implement accept
  };

  const handleRejectRequest = async (id) => {
    // TODO: implement reject
  };

  const filteredFriends = friends.filter((friend) => {
    if (activeTab === 'all') return friend.follower_status === 'accepted';
    if (activeTab === 'online') return friend.follower_status === 'accepted' && friend.isOnline;
    if (activeTab === 'requests') return friend.follower_status === 'pending';
    return false;
  });

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

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
            {filteredFriends.map((friend) => (
              <div key={friend.ID} className={styles.friendCard}>
                <Link href={`/profile/${friend.ID}`}>
                  <img
                    src={friend.Avatar || "/uploads/profile.jpeg"}
                    alt={`${friend.FirstName} ${friend.LastName}`}
                    className={styles.friendAvatar}
                  />
                </Link>
                <div className={styles.friendInfo}>
                  <h3 className={styles.friendName}>
                    <Link href={`/profile/${friend.ID}`}>
                      {friend.FirstName} {friend.LastName}
                    </Link>
                  </h3>
                  {friend.NickName && (
                    <p className={styles.friendNickname}>({friend.NickName})</p>
                  )}
                  {activeTab === 'online' && friend.isOnline && (
                    <p className={styles.onlineStatus}>Online</p>
                  )}
                </div>
                <div className={styles.friendActions}>
                  {activeTab === 'requests' ? (
                    <>
                      <button
                        className={styles.followButton}
                        onClick={() => handleAcceptRequest(friend.ID)}
                      >
                        Accept
                      </button>
                      <button
                        className={styles.ignoreButton}
                        onClick={() => handleRejectRequest(friend.ID)}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className={styles.messageButton}
                        onClick={() => {
                          /* TODO: Implement messaging */
                        }}
                      >
                        Message
                      </button>
                      <FollowButton targetUserId={friend.ID} />
                    </>
                  )}
                </div>
              </div>
            ))}
            {filteredFriends.length === 0 && (
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
                <div key={suggestion.ID} className={styles.friendCard}>
                  <Link href={`/profile/${suggestion.ID}`}>
                    <img
                      src={suggestion.Avatar || "/uploads/profile.jpeg"}
                      alt={`${suggestion.FirstName} ${suggestion.LastName}`}
                      className={styles.friendAvatar}
                    />
                  </Link>
                  <div className={styles.friendInfo}>
                    <h3 className={styles.friendName}>
                      <Link href={`/profile/${suggestion.ID}`}>
                        {suggestion.FirstName} {suggestion.LastName}
                      </Link>
                    </h3>
                    {suggestion.NickName && (
                      <p className={styles.friendNickname}>({suggestion.NickName})</p>
                    )}
                  </div>
                  <div className={styles.friendActions}>
                    <FollowButton targetUserId={suggestion.ID} />
                    <button className={styles.ignoreButton}>Ignore</button>
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