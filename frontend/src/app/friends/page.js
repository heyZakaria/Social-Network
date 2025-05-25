'use client';

// import { getCurrentUser } from "@/actions/auth";
import styles from "@/styles/friends.module.css";
import FloatingChat from "@/components/chat/floating-chat";
import { useUser } from "@/app/(utils)/user_context";
import { useEffect, useState } from "react";

export default function FriendsPage() {
  const [friends, setFriends] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const { user: currentUser } = useUser();

  useEffect(() => {
    async function fetchFriends() {
      try {
        // Fetch current user's profile to get followers/following
        const profileRes = await fetch('/api/users/profile', {
          credentials: 'include',
        });
        const profileData = await profileRes.json();
        
        if (profileData.success) {
          const userData = profileData.data.Data;
          setFriends(userData.followers || []);
          
          // Fetch suggestions (users not in followers/following)
          const suggestionsRes = await fetch('/api/users/suggestions', {
            credentials: 'include',
          });
          const suggestionsData = await suggestionsRes.json();
          
          if (suggestionsData.success) {
            setSuggestions(suggestionsData.data.users || []);
          }
        }
      } catch (error) {
        console.error('Error fetching friends:', error);
      } finally {
        setLoading(false);
      }
    }

    if (currentUser) {
      fetchFriends();
    }
  }, [currentUser]);

  const handleFollow = async (userId) => {
    try {
      const res = await fetch(`/api/users/follow?id=${userId}`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      
      if (data.success) {
        // Refresh friends list
        const profileRes = await fetch('/api/users/profile', {
          credentials: 'include',
        });
        const profileData = await profileRes.json();
        if (profileData.success) {
          setFriends(profileData.data.Data.followers || []);
        }
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      const res = await fetch(`/api/users/follow?id=${userId}`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      
      if (data.success) {
        // Refresh friends list
        const profileRes = await fetch('/api/users/profile', {
          credentials: 'include',
        });
        const profileData = await profileRes.json();
        if (profileData.success) {
          setFriends(profileData.data.Data.followers || []);
        }
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const handleAcceptRequest = async (userId) => {
    try {
      const res = await fetch(`/api/users/follow/accept?id=${userId}`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      
      if (data.success) {
        // Refresh friends list
        const profileRes = await fetch('/api/users/profile', {
          credentials: 'include',
        });
        const profileData = await profileRes.json();
        if (profileData.success) {
          setFriends(profileData.data.Data.followers || []);
        }
      }
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleRejectRequest = async (userId) => {
    try {
      const res = await fetch(`/api/users/follow/reject?id=${userId}`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      
      if (data.success) {
        // Refresh friends list
        const profileRes = await fetch('/api/users/profile', {
          credentials: 'include',
        });
        const profileData = await profileRes.json();
        if (profileData.success) {
          setFriends(profileData.data.Data.followers || []);
        }
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const filteredFriends = friends.filter(friend => {
    switch (activeTab) {
      case 'online':
        return friend.isOnline;
      case 'requests':
        return friend.follower_status === 'pending';
      default:
        return true;
    }
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
        <button 
          className={`${styles.tabButton} ${activeTab === 'all' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Friends
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'online' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('online')}
        >
          Online
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'requests' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Requests
        </button>
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
                <img
                  src={friend.Avatar || "/placeholder.svg?height=80&width=80"}
                  alt={`${friend.FirstName} ${friend.LastName}`}
                  className={styles.friendAvatar}
                />
                <div className={styles.friendInfo}>
                  <h3 className={styles.friendName}>
                    {friend.FirstName} {friend.LastName}
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
                        onClick={() => {/* TODO: Implement messaging */}}
                      >
                        Message
                      </button>
                      <button 
                        className={styles.unfollowButton}
                        onClick={() => handleUnfollow(friend.ID)}
                      >
                        Unfollow
                      </button>
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

        {activeTab === 'all' && (
        <div className={styles.friendsSection}>
          <h2 className={styles.sectionTitle}>People You May Know</h2>
          <div className={styles.friendsGrid}>
              {suggestions.map((suggestion) => (
                <div key={suggestion.ID} className={styles.friendCard}>
                  <img
                    src={suggestion.Avatar || "/placeholder.svg?height=80&width=80"}
                    alt={`${suggestion.FirstName} ${suggestion.LastName}`}
                  className={styles.friendAvatar}
                />
                <div className={styles.friendInfo}>
                  <h3 className={styles.friendName}>
                      {suggestion.FirstName} {suggestion.LastName}
                  </h3>
                    {suggestion.NickName && (
                      <p className={styles.friendNickname}>({suggestion.NickName})</p>
                  )}
                </div>
                <div className={styles.friendActions}>
                    <button 
                      className={styles.followButton}
                      onClick={() => handleFollow(suggestion.ID)}
                    >
                      Follow
                    </button>
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
