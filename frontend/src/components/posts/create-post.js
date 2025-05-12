"use client";

import { useState } from "react";
import styles from "@/styles/posts.module.css";
import EmojiPicker from "@/components/common/emoji-picker";
import { BsImage, BsX } from 'react-icons/bs';
import { MdOutlineMood } from 'react-icons/md';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { IoGlobeOutline } from 'react-icons/io5';
import { HiUsers, HiLockClosed } from 'react-icons/hi2';


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
                <BsX size={20} />
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
                <option value="public">
                  <IoGlobeOutline size={16} /> Everyone
                </option>
                <option value="followers">
                  <HiUsers size={16} /> Followers only
                </option>
                <option value="private">
                  <HiLockClosed size={16} /> Selected followers
                </option>
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
                <BsImage size={20} />
                Photo/GIF
              </label>

              <div className={styles.createPostAction}>
                <MdOutlineMood size={20} />
                <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                Emoji
              </div>

              <button className={styles.createPostAction} type="button">
              <HiOutlineLocationMarker size={20} />
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
