"use client";
import { useEffect, useState, useRef, memo } from "react";
import { useFriends } from "@/context/friends_context";
import { FaUserPlus, FaUserCheck, FaClock } from "react-icons/fa";
import styles from "@/styles/profile.module.css";

function FollowButton({ targetUserId }) {
  const { getFollowStatus, toggleFollow, followStatuses, updateFollowStatus } = useFriends();
  const statusRef = useRef({ isFollowing: false, requestPending: false });
  const [status, setStatus] = useState(statusRef.current);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(false);

  // Listen to global follow status changes - this is the key for real-time updates
  useEffect(() => {
    if (!targetUserId) return;

    const id = String(targetUserId);
    const globalStatus = followStatuses?.[id];
    
    console.log(`Follow status update for user ${id}:`, globalStatus); // Debug log
    
    if (globalStatus && JSON.stringify(statusRef.current) !== JSON.stringify(globalStatus)) {
      console.log(`Updating local status for user ${id} from:`, statusRef.current, 'to:', globalStatus); // Debug log
      statusRef.current = globalStatus;
      setStatus(globalStatus);
      setLoading(false); // Stop loading when we get global update
    }
  }, [followStatuses, targetUserId]);

  // Initial fetch and periodic updates
  useEffect(() => {
    if (!targetUserId) return;

    let isMounted = true;

    const fetchStatus = async () => {
      // Only fetch if we don't have a cached status
      const id = String(targetUserId);
      const cachedStatus = followStatuses?.[id];
      
      if (cachedStatus) {
        if (JSON.stringify(statusRef.current) !== JSON.stringify(cachedStatus)) {
          statusRef.current = cachedStatus;
          setStatus(cachedStatus);
        }
        if (isMounted) setLoading(false);
        return;
      }

      const res = await getFollowStatus(targetUserId);
      const hasChanged = JSON.stringify(statusRef.current) !== JSON.stringify(res);

      if (hasChanged && isMounted) {
        statusRef.current = res;
        setStatus(res);
      }

      if (isMounted) setLoading(false);
    };

    fetchStatus();
    
    // Reduce polling frequency since we have real-time updates
    const interval = setInterval(fetchStatus, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [targetUserId, getFollowStatus, followStatuses]);

  const handleClick = async () => {
    if (status.isFollowing) {
      setConfirm(true);
    } else {
      setLoading(true);
      try {
        const res = await toggleFollow(targetUserId);
        // Don't manually update here - let the context handle it
        // The global state listener will update this component
      } catch (error) {
        console.error("Follow error:", error);
        setLoading(false);
      }
    }
  };

  const confirmUnfollow = async () => {
    setLoading(true);
    setConfirm(false);
    try {
      const res = await toggleFollow(targetUserId);
      // Don't manually update here - let the context handle it
      // The global state listener will update this component
    } catch (error) {
      console.error("Unfollow error:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className={`${styles.followButton} ${
          status.isFollowing ? styles.following : status.requestPending ? styles.pending : ""
        }`}
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? (
          "⏳ Processing..."
        ) : status.isFollowing ? (
          <>
            <FaUserCheck /> Following
          </>
        ) : status.requestPending ? (
          <>
            <FaClock /> Requested
          </>
        ) : (
          <>
            <FaUserPlus /> Follow
          </>
        )}
      </button>

      {confirm && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <p>Are you sure you want to unfollow this user?</p>
            <div className={styles.popupButtons}>
              <button onClick={confirmUnfollow} className={styles.confirmBtn}>
                Yes
              </button>
              <button onClick={() => setConfirm(false)} className={styles.cancelBtn}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default memo(FollowButton, (prevProps, nextProps) => {
  return prevProps.targetUserId === nextProps.targetUserId;
});