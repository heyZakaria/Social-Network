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
  const [selectedImage, setSelectedImage] = useState(null);

  const [displayedComments, setDisplayedComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllComments, setShowAllComments] = useState(false);
  const COMMENTS_TO_SHOW = 2; // Initial number of comments to show

  console.log("currentUser////////////", postId, newComment, currentUser.id);


  // useEffect(() => {
  //   const fetchComments = async () => {
  //     try {
  //       setIsLoading(true);

  //       setComments(mockComments);
  //       updateDisplayedComments(mockComments, showAllComments);
  //       setIsLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching comments:", error);
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchComments();
  // }, [postId, showAllComments]);

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

  const handleEmojiSelect = (emoji) => {
    setNewComment((prevComment) => prevComment + emoji);
  };


  const validComment = () => {
    let isValid = true;
    if (!newComment?.trim() && !selectedImage) {
      isValid = false
    }
    if (newComment) {
      if (newComment.length > 1000) {
        isValid = false;
      }
      if (!newComment.trim()) {
        isValid = false;
      }
    }
    if (selectedImage) {
      if (!selectedImage.type.startsWith('image/')) {
        isValid = false;
      }
      if (selectedImage.size > 10 * 1024 * 1024) {
        isValid = false;
      }
    }
    return isValid
  }


  const handleSubmitComment = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    const isValid = validComment()

    if (isValid) {

      try {
        setIsLoading(true);
        const formData = new FormData()
        formData.append('postId', postId);
        if (newComment) {
          formData.append('content', newComment)
        }


        const response = await fetch('http://localhost:8080/comment/sendcomment', {
          method: 'POST',
          credentials: 'include', // This sends cookies with the request
          body: formData,
        });
        console.log("res ==> ", response);

        if (!response.ok) {
          console.log("error ====>", response.error);
          return;
        }

        const newCommentFromServer = await response.json();

        console.log("comment ==> ", newCommentFromServer[0]);
        
        const updatedComments = [...comments, newCommentFromServer[0]];
        setComments(updatedComments);
        updateDisplayedComments(updatedComments, showAllComments);
        setIsLoading(false)
        setNewComment("");
      } catch (error) {
        console.error("Error adding comment:", error);
      } finally {
        setIsLoading(false)
        setIsSubmitting(false);
      }
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
                    src={currentUser.avatar || // TODO add default avatar
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

          {/* {comments.length > COMMENTS_TO_SHOW && (
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
          )} */}
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
