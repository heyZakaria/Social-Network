"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "../../styles/posts.module.css";
import CommentSection from "./comment-section";

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
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        );
      case "followers":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        );
      case "private":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        );
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill={isLiked ? "#7c3aed" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                </svg>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={isLiked ? "#7c3aed" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
            </svg>
            {isLiked ? "Liked" : "Like"}
          </button>

          <button
            className={styles.interactionButton}
            onClick={() => setShowCommentsSection(!showCommentsSection)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            Comment
          </button>

          <button className={styles.interactionButton}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
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
