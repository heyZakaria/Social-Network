"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/styles/posts.module.css";
import EmojiPicker from "@/components/common/emoji-picker";
import { IoPaperPlaneOutline } from 'react-icons/io5';
import { FetchData } from "@/context/fetchJson";
import { useUser } from '@/context/user_context';
import Image from "next/image"

export default function CommentSection({setCommentsCount, postId }) {
   const { user: currentUser } = useUser();
  const [comments, setComments] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const [displayedComments, setDisplayedComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllComments, setShowAllComments] = useState(false);
  const COMMENTS_TO_SHOW = 2; // Initial number of comments to show

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const Data = await FetchData(`/api/comment/getcomment?post_id=${postId}`)
        console.log("================aciba==============");
        console.log(Data);
        console.log("==============================");
        
        setComments(Data.data.Comments);
        updateDisplayedComments(Data.data.Comments, showAllComments);
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

  const handleEmojiSelect = (emoji) => {
    setNewComment((prevComment) => prevComment + emoji);
  };


  const validComment = () => {
    let isValid = true;
    if (newComment) {
      if (newComment.length < 1) {
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
  const handleHideComments = () => {
    setShowAllComments(false);
  };

  const handleSubmitComment = async (e) => {
    
    e.preventDefault();

    setIsSubmitting(true);

    const isValid = validComment()
    console.log("isValid", isValid);
    
    if (isValid) {
      try {
        
        const newCommentObj = {
          postId: postId,
          content: newComment,
          }

        const respone = await FetchData("/api/comment/sendcomment", "POST", newCommentObj )
        
        newCommentObj.UserID = currentUser.id;
        newCommentObj.ID = respone.data.Comment.ID;
        newCommentObj.FirstName = currentUser.firstName;
        newCommentObj.LastName = currentUser.lastName;
        newCommentObj.CreatedAt = Date.now()
        newCommentObj.Avatar = currentUser.avatar || "/uploads/profile.jpeg"; // Default avatar if not set

        const updatedComments = [newCommentObj, ...comments];
        setComments(updatedComments);
        updateDisplayedComments(updatedComments, showAllComments);
        setCommentsCount(comments.length + 1)
        setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
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
              <div key={comment.ID} className={styles.comment}>
                <Link
                  href={`/profile/${comment.UserID}`}
                  className={styles.commentAvatar}
                >
                  <Image width={200} height={100}
                    src={comment.Avatar || // TODO add default avatar
                      "/uploads/profile.jpeg"
                    }
                    alt={comment.FirstName}
                  />
                </Link>
                <div className={styles.commentContent}>
                  <div className={styles.commentBubble}>
                    <Link
                      href={`/profile/${comment.UserID}`}
                      className={styles.commentUser}
                    >
                      {comment.FirstName} {comment.LastName}
                    </Link>
                    <p className={styles.commentText}>{comment.content}</p>
                  </div>
                  <div className={styles.commentActions}>
                    <span className={styles.commentTime}>
                      {formatDate(comment.CreatedAt)}
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
        <Image width={200} height={100}
          src={currentUser.avatar || "/uploads/profile.jpeg"}
          alt="User avatar"
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

      {/* select image  */}
        {selectedImage && (
        <div className={styles.imagePreview}>
          <Image width={200} height={100}
            src={URL.createObjectURL(selectedImage)}
            className={styles.previewImage}
          />
          <button
            onClick={() => {
              setSelectedImage(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className={styles.removeImageButton}
            type="button"
            disabled={isLoading}
          >
            ×
          </button>
        </div>
      )}
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
