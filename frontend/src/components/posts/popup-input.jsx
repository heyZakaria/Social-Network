"use client";

import styles from "@/styles/posts.module.css";
import { useState } from "react";

const PopupInput = ({ postContent, onContentChange, currentUser}) => {

  const [showPopup, setShowPopup] = useState(false);
  const [localContent, setLocalContent] = useState(postContent || '');

  // manage popup input
  const handleInputClick = () => {
      setLocalContent(postContent || '');
      setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setLocalContent(postContent || ''); // Reset to original content
  };

  const saveContent = () => {
    onContentChange?.(localContent); // Pass content back to parent
    setShowPopup(false);
  };

  const handleTextareaChange = (e) => {
    setLocalContent(e.target.value);
  };

  return (
    <div className={styles.textareaContainer}>
      <textarea
        placeholder={`What's on your mind, ${currentUser.firstName}?`}
        className={styles.createPostInput}
        onClick={handleInputClick}
        value={postContent ? `${postContent.substring(0, 200)}${postContent.length > 200 ? ' ...' : ''}` : ''}
        readOnly
        // disabled={disabled}
      />
      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <span className={styles.closeButton} onClick={closePopup}>&times;</span>
            <h2 className={styles.titleStyle}>Create Post</h2>
            <textarea
              placeholder={`What's on your mind, ${currentUser.firstName}?`}
              className={styles.popupTextarea}
              value={localContent}
              onChange={handleTextareaChange}
              // disabled={disabled}
              rows={6}
            />
            <div className={styles.popupActions}>
              <button
                onClick={closePopup}
                className={styles.cancelButton}
                // disabled={disabled}
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={saveContent}
                className={styles.postButton}
                type="button"
                // disabled={disabled}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopupInput;