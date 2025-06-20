"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "../../styles/posts.module.css";
import CommentSection from "./comment-section";
import { IoHeartOutline, IoGlobeOutline } from 'react-icons/io5';
import { BiShare, BiComment, BiDotsHorizontalRounded } from 'react-icons/bi';
import { HiUsers, HiLockClosed } from 'react-icons/hi2';
import { FetchData } from "@/context/fetchJson";
import Image from "next/image";

export default function PostComponent({
  post,
  user,
  currentUser,
  showComments = false,
}) {
  const [isLiked, setIsLiked] = useState(post.Liked);
  const [likesCount, setLikesCount] = useState(post.LikeCounts);
  const [commentsCount, setCommentsCount] = useState(post.CommentCounts);
  const [showCommentsSection, setShowCommentsSection] = useState(showComments);
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_CONTENT_LENGTH = 250; // Maximum characters to show before "See more"

  const handleLike = () => {
    async function updateLikeStatus() {
      const response = await FetchData(
        `/api/likes/react?id=${post.PostId}`, "POST")
      console.log('responce ===> :', response);
      const LikeCounts = response.data.like_count
      const Like = response.data.success

      setIsLiked(!isLiked);
      setLikesCount(LikeCounts);



    }
    updateLikeStatus()
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
    switch (post.Privacy) {
      case "public":
        return <IoGlobeOutline size={16} />;
      case "followers":
        return <HiUsers size={16} />;
      case "custom_users":
        return <HiLockClosed size={16} />;
      default:
        return null;
    }
  };
  // Function to render post content with "See more" functionality
  const renderPostContent = () => {
    if (!post.Post_Content) return null;

    if (post.Post_Content.length <= MAX_CONTENT_LENGTH || isExpanded) {
      return <p>{post.Post_Content}</p>;
    }

    return (
      <p>
        {post.Post_Content.substring(0, MAX_CONTENT_LENGTH)}...
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
        <Link href={`/profile/${post.UserID}`} className={styles.postUser}>
          <div className={styles.avatarWrapper}>
            <Image
              src={post.User_avatar || "/uploads/profile.jpeg"}
              alt={post.First_name}
              className={styles.postAvatar}
              width={48}
              height={48}
              style={{ objectFit: "cover", borderRadius: "50%" }}
            />
          </div>
          <div className={styles.postUserInfo}>
            <div className={styles.postUserName}>
              {post.First_name} {post.Last_name}
            </div>
            <div className={styles.postMeta}>
              <span className={styles.postTime}>
                {formatDate(post.CreatedAt)}
              </span>
              <span
                className={styles.postPrivacy}
                title={`This post is ${post.Privacy}`}
              >
                {getPrivacyIcon()}
              </span>
            </div>
          </div>
        </Link>
      </div>

      <div className={styles.postContent}>
        {renderPostContent()}
        {post.Post_image && (
          <div className={styles.postImageWrapper}>
            <Image
              src={post.Post_image}
              alt="Post"
              className={styles.postImage}
              width={200}
              height={100}
              style={{ width: "auto", height: "auto", objectFit: "cover", borderRadius: "8px" }}
            />
          </div>
        )}
      </div>

      <div className={styles.postFooter}>
        <div className={styles.postStats}>
          <div className={styles.likesCount}>
            {post.LikeCounts >= 0 && (
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
            {commentsCount || 0} comments
          </button>
        </div>

        <div className={styles.postInteractions}>
          <button
            className={`${styles.interactionButton} ${isLiked ? styles.liked : ""
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
        </div>
      </div>

      {showCommentsSection && (
        <CommentSection setCommentsCount={setCommentsCount} postId={post.PostId} currentUser={currentUser} />
      )}
    </div>
  );
}
