"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "@/styles/posts.module.css";
import { BsImage } from 'react-icons/bs';
import EmojiPicker from "@/components/common/emoji-picker";
import { IoPaperPlaneOutline } from 'react-icons/io5';
import { FetchData } from "@/context/fetchJson";
import { useUser } from '@/context/user_context';
import Image from "next/image"
import { logoutUser } from "@/app/(auth)/_logout/logout";

export default function CommentSection({ setCommentsCount, postId }) {
  const { user: currentUser } = useUser();
  const [comments, setComments] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [ErrorMsg, SetErrorMsg] = useState("");
  const [displayedComments, setDisplayedComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showAllComments, setShowAllComments] = useState(false);
  const COMMENTS_TO_SHOW = 2; 

  useEffect(() => {

    // get comments
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const Data = await FetchData(`/api/comment/getcomment?post_id=${postId}`)    
        console.log("Comment Data GET", Data);
            
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
  }


  const fileInputRef = useRef(null);
  // Handle image selection
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  // reset form comment
  const resetForm = () => {
    setNewComment('');
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

    const isValid = validComment()
    console.log("isValid", isValid);

    if (isValid) {
      try {

        const formData = new FormData()

        if ((selectedImage) && (newComment)) {
          formData.append("content", newComment)
          formData.append("comment_image", selectedImage)
        } else if (selectedImage) {
          formData.append("comment_image", selectedImage)
        } else {
          formData.append("content", newComment)
        }

        formData.append("postId", postId)

        const response = await fetch('/api/comment/sendcomment', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });


        const data = await response.json();

        if (data.success) {
          SetErrorMsg("");
          resetForm();
//           {
//     "ID": "c3b66551-790d-4134-9bcd-dcb12d66d331",
//     "UserID": "1c7d4180-e42b-4407-aa0e-a5441e1dcd94",
//     "postId": 0,
//     "content": "",
//     "comment_image": "/uploads/comment/469931b4-8477-478b-a52a-90293b0f5ae0.webp",
//     "FirstName": "Christopher",
//     "LastName": "Jenkins",
//     "Avatar": "",
//     "CreatedAt": "2025-06-24T19:34:06Z",
//     "FormattedDate": "06/24/2025, 7:34:06 PM"
// }
// {
//     "postId": 2,
//     "content": "",
//     "comment_img": "/uploads/comment/b8d3d5b4-7312-4e89-8ac7-c10c67689523.webp",
//     "UserID": "1c7d4180-e42b-4407-aa0e-a5441e1dcd94",
//     "ID": "7cfdc6cf-c037-4d65-b640-adfd404a738d",
//     "FirstName": "Christopher",
//     "LastName": "Jenkins",
//     "CreatedAt": "2025-06-24T18:35:31.361Z",
//     "Avatar": "/uploads/profile.jpeg"
// }
          const newCommentObj = {
            postId: postId,
            content: newComment,
            comment_image: data?.data?.Comment?.comment_image || null,
            UserID: currentUser.id,
            ID: data.data.Comment.ID,
            FirstName: currentUser.firstName,
            LastName: currentUser.lastName,
            CreatedAt: new Date().toISOString(),
            Avatar: currentUser.avatar || "/uploads/profile.jpeg"
          }
        console.log("Comment Data POST", newCommentObj);
          
          const updatedComments = [newCommentObj, ...comments];
          setComments(updatedComments);
          updateDisplayedComments(updatedComments, showAllComments);
          setCommentsCount(comments.length + 1);
          setNewComment("");
        } else {
          if (data.error == "You are not Authorized.") {
            await logoutUser()
            window.location.href = "/login"
          } else {
            SetErrorMsg(data.error);
          }
        }

      } catch (error) {
        console.error("Error adding comment:", error);
      } 
    } else {
      resetForm()
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
                  <Image
                    width={200}
                    height={100}
                    src={comment.Avatar || "/uploads/profile.jpeg"}
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

                    {comment.content && (
                      <p className={styles.commentText}>{comment.content}</p>
                    )}

                    {comment.comment_image && (
                      <div className={styles.commentImage}>
                        <Image
                          src={comment.comment_image}
                          alt="Comment attachment"
                          width={300}
                          height={200}
                          className={styles.commentImg}
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    )}
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
         {ErrorMsg && <div className={styles.ErrorMessage}>{ErrorMsg}</div>}
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
          />
          <div className={styles.commentInputActions}>
            <EmojiPicker onEmojiSelect={handleEmojiSelect} />
          </div>
        </div>

        <div className={styles.buImgCont}>
          <button
            className={styles.imgAction}
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            <BsImage size={20} />
            Photo/GIF
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>
        <button
          type="submit"
          className={styles.commentSubmit}
        >
          <IoPaperPlaneOutline size={16} />
        </button>
      </form>
      {selectedImage && (
        <div className={styles.imagePreview}>
          <Image width={200} height={100}
            alt="Selected Preview"
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
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
