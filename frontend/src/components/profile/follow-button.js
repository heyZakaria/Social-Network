'use client';
import { useEffect, useState, memo } from "react";
import { useFriends } from "@/context/friends_context";
import { FaUserPlus, FaUserCheck, FaClock } from "react-icons/fa";
import styles from "@/styles/profile.module.css";

function FollowButton({ targetUserId }) {
  const {
    followStatuses,
    toggleFollow,
    startStatusPolling,
  } = useFriends();

  const [status, setStatus] = useState({ isFollowing: false, requestPending: false });
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(false);

  // Poll the follow status every 1 second
  useEffect(() => {
    if (!targetUserId) return;
    startStatusPolling(targetUserId);
  }, [targetUserId, startStatusPolling]);

  // Update local status when global changes
  useEffect(() => {
    const updatedStatus = followStatuses?.[targetUserId];
    if (updatedStatus) {
      setStatus(updatedStatus);
      setLoading(false);
    }
  }, [followStatuses, targetUserId]);

  const handleClick = async () => {
    if (status.isFollowing) {
      setConfirm(true);
    } else {
      setLoading(true);
      await toggleFollow(targetUserId);
    }
  };

  const confirmUnfollow = async () => {
    setLoading(true);
    setConfirm(false);
    await toggleFollow(targetUserId);
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
              <button onClick={confirmUnfollow} className={styles.confirmBtn}>Yes</button>
              <button onClick={() => setConfirm(false)} className={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default memo(FollowButton, (prev, next) => prev.targetUserId === next.targetUserId);
