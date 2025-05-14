"use client";

import { useState } from "react";
import styles from "@/styles/home.module.css";
import { BsImage } from "react-icons/bs";
import { MdOutlineMood } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";
import PostComponent from "@/components/posts/post-component";
import FloatingChat from "@/components/chat/floating-chat";
export default function Home() {
  const currentUser = {
    id: 1,
    avatar: "",
    firstName: "test",
    lastName: "test",
  };

  const [posts] = useState([
    {
      id: 2,
      content:
        "Check out this amazing sunset I captured yesterday evening. #photography #sunset",
      image:
        "https://imgs.search.brave.com/jLfYC2vnVrdKM1pTa5AmFzHt4c7QNiv3c6zQe-UtXoA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcm9t/by5jb20vdG9vbHMv/aW1hZ2UtcmVzaXpl/ci9zdGF0aWMvUGF0/dGVybl9pbWFnZS04/YzA1MDA1M2VhYjg4/NGU1MWI4NTk5NjA3/ODY1ZDExMi5qcGc",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      likes: [],
      comments: [],
      privacy: "public",
      user: {
        id: 3,
        firstName: "Jane",
        lastName: "Smith",
        avatar: "https://i.pravatar.cc/150?u=11",
      },
    },
  ]);

  // start fix create post 

  const [showPopup, setShowPopup] = useState(false);
  const [showPopupFollowers, setShowPopupFollowers] = useState(false);
  const [selectedFollowers, setSelectedFollowers] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedPrivacy, setSelectedPrivacy] = useState('public');
const [postContent, setPostContent] = useState('')
  const handleInputClick = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

const handleInputClickPrivate = () => {
    setShowPopupFollowers(true);
  };

  const closePopupPrivate = () => {
    setShowPopupFollowers(false);
  };


  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const selectPrivacy = (privacy) => {
    setSelectedPrivacy(privacy);
    setShowOptions(false);

    if (privacy === 'private') {
      handleInputClickPrivate();
    }
  };

  const toggleFollower = (followerId) => {
    if (selectedFollowers.includes(followerId)) {
      setSelectedFollowers(selectedFollowers.filter(id => id !== followerId));
    } else {
      setSelectedFollowers([...selectedFollowers, followerId]);
    }
  };
 const saveSelectedFollowers = () => {
    closePopupPrivate();
  };

  const saveContent = () => {
    closePopup()
  }
  // Get display text for the button
  const getDisplayText = () => {
    switch(selectedPrivacy) {
      case 'public': return 'Public';
      case 'almostPrivate': return 'Followers';
      case 'private': return `Selected (${selectedFollowers.length})`;
      default: return 'Public';
    }
  };

  // Get icon for the button
  const getPrivacyIcon = () => {
    switch(selectedPrivacy) {
      case 'public': return '🌎';
      case 'almostPrivate': return '👥';
      case 'private': return '🔒';
      default: return '🌎';
    }
  };
 const followers = [
    { id: 1, name: 'John Smith', avatar: '/api/placeholder/40/40' },
    { id: 2, name: 'Sarah Johnson', avatar: '/api/placeholder/40/40' },
    { id: 3, name: 'Michael Brown', avatar: '/api/placeholder/40/40' },
    { id: 4, name: 'Emily Wilson', avatar: '/api/placeholder/40/40' },
    { id: 5, name: 'David Lee', avatar: '/api/placeholder/40/40' }
  ];
  return (
    <div className={styles.homePage}>
      <div className={styles.mainContent}>
        <div className={styles.contentArea}>
          <div className={styles.createPost}>
            <div className={styles.createPostHeader}>
              <img
                // src={currentUser.avatar || "https://i.pravatar.cc/150?u=10"}
                className={styles.createPostAvatar}
              />
              <div>
      {/* Input field showing current content, opens popup on click */}
      <input
        type="text"
        placeholder={`What's on your mind, ${currentUser.firstName}?`}
        className={styles.createPostInput}
        onClick={handleInputClick}
        value={postContent}
        readOnly // Makes the input read-only to force editing via popup
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
              autoFocus
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
            </div>
            <div className={styles.createPostActions}>
              <button className={styles.createPostAction}>
                <BsImage size={20} />
                Photo/GIF
              </button>
              <div className={styles.container}>
      {/* Main Button */}
      <button 
        onClick={toggleOptions}
        className={styles.privacyButton}
      >
        <span>{getPrivacyIcon()}</span>
        <span>{getDisplayText()}</span>
        <span className={styles.dropdownArrow}>▼</span>
      </button>

      {/* Dropdown Options */}
      {showOptions && (
        <div className={styles.optionsDropdown}>
          <div className={styles.optionsWrapper}>
            <button 
              onClick={() => selectPrivacy('public')}
              className={styles.optionButton}
            >
              <span className={styles.optionIcon}>🌎</span>
              <div>
                <p className={styles.optionTitle}>Public</p>
                <p className={styles.textStyle}>All users will see this post</p>
              </div>
            </button>

            <button 
              onClick={() => selectPrivacy('almostPrivate')}
              className={styles.optionButton}
            >
              <span className={styles.optionIcon}>👥</span>
              <div>
                <p className={styles.optionTitle}>Followers</p>
                <p className={styles.textStyle}>Only your followers will see this post</p>
              </div>
            </button>

            <button 
              onClick={() => selectPrivacy('private')}
              className={styles.optionButton}
            >
              <span className={styles.optionIcon}>🔒</span>
              <div>
                <p className={styles.optionTitle}>Selected Followers</p>
                 <p className={styles.textStyle}>Only chosen followers will see this post</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Follower Selection Popup */}
      {showPopupFollowers && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContainer}>
            <div className={styles.popupHeader}>
              <h3 className={styles.popupTitle}>Select Followers</h3>
              <button onClick={closePopup} className={styles.closeButton}>
                &times;
              </button>
            </div>
            
            <div className={styles.followersList}>
              {followers.map(follower => (
                <div key={follower.id} className={styles.followerItem}>
                  <input 
                    type="checkbox" 
                    id={`follower-${follower.id}`}
                    checked={selectedFollowers.includes(follower.id)}
                    onChange={() => toggleFollower(follower.id)}
                    className={styles.followerCheckbox}
                  />
                  <img src={follower.avatar} alt={follower.name} className={styles.followerAvatar} />
                  <label htmlFor={`follower-${follower.id}`} className={styles.followerName}>
                    {follower.name}
                  </label>
                </div>
              ))}
            </div>
            
            <div className={styles.popupFooter}>
              <button 
                onClick={closePopupPrivate}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button 
                onClick={saveSelectedFollowers}
                className={styles.saveButton}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
              <button 
              className={styles.postButton}>
                
                post
              </button>
            </div>
          </div>

          <div className={styles.feed}>
            {posts.map((post) => (
              <PostComponent
                key={post.id}
                post={post}
                user={post.user}
                currentUser={currentUser}
              />
            ))}
          </div>
        </div>
      </div>
      <FloatingChat currentUser={currentUser} />
    </div>
  );
}
