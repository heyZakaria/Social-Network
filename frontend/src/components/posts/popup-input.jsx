"use client";

import styles from "@/styles/posts.module.css";

import { useState } from "react";

const PopupInput = () => {

  const currentUser = {
    id: 1,
    avatar: "",
    firstName: "test",
    lastName: "test",
  };

  const [showPopup, setShowPopup] = useState(false);

  const [postContent, setPostContent] = useState('')

  // manage popup input
  const handleInputClick = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const saveContent = () => {
    closePopup()
  }

  return (
    <div>
      <input
        type="text"
        placeholder={`What's on your mind, ${currentUser.firstName}?`}
        className={styles.createPostInput}
        onClick={handleInputClick}
      />
      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <span className={styles.closeButton} onClick={closePopup}>&times;</span>
            <h2 className={styles.titleStyle}>Create Post</h2>
            <textarea
              placeholder={`What's on your mind, ${currentUser.firstName}?`}
              className={styles.popupTextarea}
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
            <button
              onClick={saveContent}
              className={styles.postButton}
            >
              done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PopupInput