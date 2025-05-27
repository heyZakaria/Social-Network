"use client";
import { useEffect, useState } from "react";
import { useFriends } from "@/app/(utils)/friends-context";
import { FaUserPlus, FaUserCheck, FaClock } from "react-icons/fa";
import styles from "@/styles/profile.module.css";

export default function FollowButton({ targetUserId }) {
  const { getFollowStatus, toggleFollow } = useFriends();
  const [status, setStatus] = useState({ isFollowing: false, requestPending: false });
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    if (!targetUserId) return;
    (async () => {
      setLoading(true);
      const res = await getFollowStatus(targetUserId);
      setStatus(res);
      setLoading(false);
    })();
  }, [targetUserId]);

  const handleClick = async () => {
    if (status.isFollowing) {
      setConfirm(true);
    } else {
      setLoading(true);
      const res = await toggleFollow(targetUserId);
      setStatus(res);
      setLoading(false);
    }
  };

  const confirmUnfollow = async () => {
    setLoading(true);
    const res = await toggleFollow(targetUserId);
    setStatus(res);
    setConfirm(false);
    setLoading(false);
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
