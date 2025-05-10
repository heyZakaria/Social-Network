"use client";

import { useState } from "react";
import styles from "../../styles/posts.module.css";
import EmojiPicker from "../common/emoji-picker";

export default function CreatePost({ user, onPostCreated }) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [privacy, setPrivacy] = useState("public");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleEmojiSelect = (emoji) => {
    setContent((prevContent) => prevContent + emoji);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() && !image) return;

    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call
      // For now, we'll simulate creating a post
      const newPost = {
        id: Date.now(),
        userId: user.id,
        content,
        image: image ? "/placeholder.svg?height=400&width=600" : null,
        privacy,
        likes: [],
        createdAt: new Date().toISOString(),
      };

      // Reset form
      setContent("");
      setImage(null);
      setImagePreview(null);
      setPrivacy("public");
      setIsExpanded(false);

      // Notify parent component
      if (onPostCreated) {
        onPostCreated(newPost);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.createPost}>
      <div className={styles.createPostHeader}>
        <img
          src={user.avatar || "https://i.pravatar.cc/150?u=10`"}
          alt={user.firstName}
          className={styles.createPostAvatar}
        />
        <div
          className={styles.createPostInput}
          onClick={() => setIsExpanded(true)}
        >
          {isExpanded ? (
            <textarea
              placeholder={`What's on your mind, ${user.firstName}?`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              autoFocus
            />
          ) : (
            <div
              className={styles.createPostPlaceholder}
            >{`What's on your mind, ${user.firstName}?`}</div>
          )}
        </div>
      </div>

      {isExpanded && (
        <>
          {imagePreview && (
            <div className={styles.imagePreview}>
              <img src={imagePreview || "/placeholder.svg"} alt="Preview" />
              <button
                className={styles.removeImageButton}
                onClick={handleRemoveImage}
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
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          )}

          <div className={styles.createPostOptions}>
            <div className={styles.privacySelector}>
              <label>Who can see this?</label>
              <select
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value)}
              >
                <option value="public">Everyone</option>
                <option value="followers">Followers only</option>
                <option value="private">Selected followers</option>
              </select>
            </div>

            <div className={styles.createPostActions}>
              <label className={styles.createPostAction}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
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
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                Photo/Video
              </label>

              <div className={styles.createPostAction}>
                <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                Emoji
              </div>

              <button className={styles.createPostAction} type="button">
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
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Location
              </button>
            </div>
          </div>

          <div className={styles.createPostFooter}>
            <button
              className={styles.cancelButton}
              onClick={() => {
                setIsExpanded(false);
                setContent("");
                setImage(null);
                setImagePreview(null);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              className={styles.postButton}
              onClick={handleSubmit}
              disabled={isSubmitting || (!content.trim() && !image)}
            >
              {isSubmitting ? "Posting..." : "Post"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
