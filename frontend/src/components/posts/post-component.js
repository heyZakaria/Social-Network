"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "../../styles/posts.module.css";
import CommentSection from "./comment-section";
import { IoHeartOutline, IoGlobeOutline } from 'react-icons/io5';
import { BiShare, BiComment, BiDotsHorizontalRounded } from 'react-icons/bi';
import { HiUsers, HiLockClosed } from 'react-icons/hi2';

export default function PostComponent({
  post,
  user,
  currentUser,
  showComments = false,
}) {
  const [isLiked, setIsLiked] = useState(post.likes.includes(currentUser.id));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [showCommentsSection, setShowCommentsSection] = useState(showComments);
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_CONTENT_LENGTH = 250; // Maximum characters to show before "See more"

  const handleLike = () => {
    if (isLiked) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }
    setIsLiked(!isLiked);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }
  };

  const getPrivacyIcon = () => {
    switch (post.privacy) {
      case "public":
        return <IoGlobeOutline size={16} />;
      case "followers":
        return <HiUsers size={16} />;
      case "private":
        return <HiLockClosed size={16} />;
      default:
        return null;
    }
  };
  // Function to render post content with "See more" functionality
  const renderPostContent = () => {
    if (!post.content) return null;

    if (post.content.length <= MAX_CONTENT_LENGTH || isExpanded) {
      return <p>{post.content}</p>;
    }

    return (
      <p>
        {post.content.substring(0, MAX_CONTENT_LENGTH)}...
        <button
          className={styles.seeMoreButton}
          onClick={() => setIsExpanded(true)}
        >
          See more
        </button>
      </p>
    );
  };

  return (
    <div className={styles.post}>
      <div className={styles.postHeader}>
        <Link href={`/profile/${user.id}`} className={styles.postUser}>
          <img
            src={user.avatar || "https://i.pravatar.cc/150?u=10`"}
            alt={user.firstName}
            className={styles.postAvatar}
          />
          <div className={styles.postUserInfo}>
            <div className={styles.postUserName}>
              {user.firstName} {user.lastName}
            </div>
            <div className={styles.postMeta}>
              <span className={styles.postTime}>
                {formatDate(post.createdAt)}
              </span>
              <span
                className={styles.postPrivacy}
                title={`This post is ${post.privacy}`}
              >
                {getPrivacyIcon()}
              </span>
            </div>
          </div>
        </Link>

        {currentUser.id === user.id && (
          <div className={styles.postActions}>
            <button className={styles.postAction}>
            <BiDotsHorizontalRounded size={16} />
            </button>
          </div>
        )}
      </div>

      <div className={styles.postContent}>
        {renderPostContent()}
        {post.image && (
          <img
            src={post.image || "/placeholder.svg"}
            alt="Post"
            className={styles.postImage}
          />
        )}
      </div>

      <div className={styles.postFooter}>
        <div className={styles.postStats}>
          <div className={styles.likesCount}>
            {likesCount > 0 && (
              <>
                <IoHeartOutline size={15} />
                <span>{likesCount}</span>
              </>
            )}
          </div>
          <button
            className={styles.commentsToggle}
            onClick={() => setShowCommentsSection(!showCommentsSection)}
          >
            {post.comments?.length || 0} comments
          </button>
        </div>

        <div className={styles.postInteractions}>
          <button
            className={`${styles.interactionButton} ${
              isLiked ? styles.liked : ""
            }`}
            onClick={handleLike}
          >
            <IoHeartOutline size={20} />
            {isLiked ? "Liked" : "Like"}
          </button>

          <button
            className={styles.interactionButton}
            onClick={() => setShowCommentsSection(!showCommentsSection)}
          >
            <BiComment size={20} />
            Comment
          </button>

          <button className={styles.interactionButton}>
          <BiShare size={20} />
            Share
          </button>
        </div>
      </div>

      {showCommentsSection && (
        <CommentSection postId={post.id} currentUser={currentUser} />
      )}
    </div>
  );
}
