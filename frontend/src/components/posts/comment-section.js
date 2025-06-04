"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/styles/posts.module.css";
import EmojiPicker from "@/components/common/emoji-picker";
import { IoPaperPlaneOutline } from 'react-icons/io5';
import { useUser } from '@/app/(utils)/user_context';


export default function CommentSection({ postId }) {
   const { user: currentUser } = useUser();
  const [comments, setComments] = useState([]);
  const [displayedComments, setDisplayedComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllComments, setShowAllComments] = useState(false);
  const COMMENTS_TO_SHOW = 2; // Initial number of comments to show

  console.log("currentUser////////////", currentUser);
  

  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll use mock data
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        const mockComments = [
          {
            id: 1,
            postId: postId,
            userId: 2,
            user: {
              id: 2,
              firstName: "Jane",
              lastName: "Smith",
              avatar: "https://i.pravatar.cc/150?u=10`",
            },
            content: "Wow, that looks amazing! Which trail was this? 😍",
            createdAt: "2023-03-10T12:15:00Z",
          },
          {
            id: 2,
            postId: postId,
            userId: 3,
            user: {
              id: 3,
              firstName: "Mike",
              lastName: "Johnson",
              avatar: "https://i.pravatar.cc/150?u=10`",
            },
            content: "Incredible views! I need to go hiking more often. 🏔️",
            createdAt: "2023-03-10T13:30:00Z",
          },
          {
            id: 3,
            postId: postId,
            userId: 4,
            user: {
              id: 4,
              firstName: "Sarah",
              lastName: "Williams",
              avatar: "https://i.pravatar.cc/150?u=10`",
            },
            content:
              "I was there last month! Did you take the north trail or the south one? 🧭",
            createdAt: "2023-03-11T09:45:00Z",
          },
          {
            id: 4,
            postId: postId,
            userId: 5,
            user: {
              id: 5,
              firstName: "Alex",
              lastName: "Brown",
              avatar: "https://i.pravatar.cc/150?u=10`",
            },
            content:
              "The colors in this photo are stunning. What camera settings did you use? 📸",
            createdAt: "2023-03-12T14:20:00Z",
          },
        ];

        setComments(mockComments);
        updateDisplayedComments(mockComments, showAllComments);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [postId, showAllComments]);

  const updateDisplayedComments = (allComments, showAll) => {
    if (showAll) {
      setDisplayedComments(allComments);
    } else {
      setDisplayedComments(allComments.slice(0, COMMENTS_TO_SHOW));
    }
  };

  const handleViewMoreComments = () => {
    setShowAllComments(true);
  };

  const handleHideComments = () => {
    setShowAllComments(false);
  };

  const handleEmojiSelect = (emoji) => {
    setNewComment((prevComment) => prevComment + emoji);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call
      // For now, we'll simulate adding a comment
      const newCommentObj = {
        id: Date.now(),
        postId: postId,
        userId: currentUser.id,
        user: {
          id: currentUser.id,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          avatar: currentUser.avatar,
        },
        content: newComment,
        createdAt: new Date().toISOString(),
      };

      const updatedComments = [...comments, newCommentObj];
      setComments(updatedComments);
      updateDisplayedComments(updatedComments, showAllComments);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <div className={styles.commentSection}>
      {isLoading ? (
        <div className={styles.loading}>Loading comments...</div>
      ) : (
        <>
          <div className={styles.comments}>
            {displayedComments.map((comment) => (
              <div key={comment.id} className={styles.comment}>
                <Link
                  href={`/profile/${comment.user.id}`}
                  className={styles.commentAvatar}
                >
                  <img
                    src={ currentUser.avatar || // TODO add default avatar
                      "/uploads/profile.jpeg"
                    }
                    alt={comment.user.firstName}
                  />
                </Link>
                <div className={styles.commentContent}>
                  <div className={styles.commentBubble}>
                    <Link
                      href={`/profile/${comment.user.id}`}
                      className={styles.commentUser}
                    >
                      {comment.user.firstName} {comment.user.lastName}
                    </Link>
                    <p className={styles.commentText}>{comment.content}</p>
                  </div>
                  <div className={styles.commentActions}>
                    <button className={styles.commentAction}>Like</button>
                    <button className={styles.commentAction}>Reply</button>
                    <span className={styles.commentTime}>
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {comments.length > COMMENTS_TO_SHOW && (
            <div className={styles.viewMoreContainer}>
              {!showAllComments ? (
                <button
                  className={styles.viewMoreButton}
                  onClick={handleViewMoreComments}
                >
                  View all {comments.length} comments
                </button>
              ) : (
                <button
                  className={styles.viewMoreButton}
                  onClick={handleHideComments}
                >
                  Show fewer comments
                </button>
              )}
            </div>
          )}
        </>
      )}

      <form className={styles.commentForm} onSubmit={handleSubmitComment}>
        <img
          src={currentUser.avatar || "/uploads/profile.jpeg"}
          alt={currentUser.firstName}
          className={styles.commentFormAvatar}
        />
        <div className={styles.commentInputContainer}>
          <input
            type="text"
            placeholder="Write a comment..."
            className={styles.commentInput}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={isSubmitting}
          />
          <div className={styles.commentInputActions}>
            <EmojiPicker onEmojiSelect={handleEmojiSelect} />
          </div>
        </div>
        <button
          type="submit"
          className={styles.commentSubmit}
          disabled={isSubmitting || !newComment.trim()}
        >
          <IoPaperPlaneOutline size={16} />
        </button>
      </form>
    </div>
  );
}
