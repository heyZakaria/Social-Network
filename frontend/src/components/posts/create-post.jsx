// "use client";
import styles from "@/styles/home.module.css";

import { useState } from "react";
import { BsImage } from "react-icons/bs";
import { MdOutlineMood } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";
import PostComponent from "@/components/posts/post-component";
import FloatingChat from "@/components/chat/floating-chat";
// import { useState } from "react";
// import styles from "@/styles/posts.module.css";
// import EmojiPicker from "@/components/common/emoji-picker";
// import { BsImage, BsX } from 'react-icons/bs';
// import { MdOutlineMood } from 'react-icons/md';
// import { HiOutlineLocationMarker } from 'react-icons/hi';
// import { IoGlobeOutline } from 'react-icons/io5';
// import { HiUsers, HiLockClosed } from 'react-icons/hi2';


// export default function CreatePost({ user, onPostCreated }) {
//   const [content, setContent] = useState("");
//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [privacy, setPrivacy] = useState("public");
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(file);

//       // Create preview
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleRemoveImage = () => {
//     setImage(null);
//     setImagePreview(null);
//   };

//   const handleEmojiSelect = (emoji) => {
//     setContent((prevContent) => prevContent + emoji);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!content.trim() && !image) return;

//     setIsSubmitting(true);

//     try {
//       // In a real app, this would be an API call
//       // For now, we'll simulate creating a post
//       const newPost = {
//         id: Date.now(),
//         userId: user.id,
//         content,
//         image: image ? "/placeholder.svg?height=400&width=600" : null,
//         privacy,
//         likes: [],
//         createdAt: new Date().toISOString(),
//       };

//       // Reset form
//       setContent("");
//       setImage(null);
//       setImagePreview(null);
//       setPrivacy("public");
//       setIsExpanded(false);

//       // Notify parent component
//       if (onPostCreated) {
//         onPostCreated(newPost);
//       }
//     } catch (error) {
//       console.error("Error creating post:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className={styles.createPost}>
//       <div className={styles.createPostHeader}>
//         <img
//           // src={user.avatar || "https://i.pravatar.cc/150?u=10`"}
//           // alt={user.firstName}
//           // className={styles.createPostAvatar}
//         />
//         <div
//           className={styles.createPostInput}
//           onClick={() => setIsExpanded(true)}
//         >
//           {isExpanded ? (
//             <textarea
//               placeholder={`What's on your mind, ${user.firstName}?`}
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               autoFocus
//             />
//           ) : (
//             <div
//               className={styles.createPostPlaceholder}
//             >{`What's on your mind, ${user.firstName}?`}</div>
//           )}
//         </div>
//       </div>

//       {isExpanded && (
//         <>
//           {imagePreview && (
//             <div className={styles.imagePreview}>
//               <img src={imagePreview || "/placeholder.svg"} alt="Preview" />
//               <button
//                 className={styles.removeImageButton}
//                 onClick={handleRemoveImage}
//               >
//                 <BsX size={20} />
//               </button>
//             </div>
//           )}

//           <div className={styles.createPostOptions}>
//             <div className={styles.privacySelector}>
//               <label>Who can see this?</label>
//               <select
//                 value={privacy}
//                 onChange={(e) => setPrivacy(e.target.value)}
//               >
//                 <option value="public">
//                   <IoGlobeOutline size={16} /> Everyone
//                 </option>
//                 <option value="followers">
//                   <HiUsers size={16} /> Followers only
//                 </option>
//                 <option value="private">
//                   <HiLockClosed size={16} /> Selected followers
//                 </option>
//               </select>
//             </div>

//             <div className={styles.createPostActions}>
//               <label className={styles.createPostAction}>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   style={{ display: "none" }}
//                 />
//                 <BsImage size={20} />
//                 Photo/GIF
//               </label>

//               <div className={styles.createPostAction}>
//                 <MdOutlineMood size={20} />
//                 <EmojiPicker onEmojiSelect={handleEmojiSelect} />
//                 Emoji
//               </div>

//               <button className={styles.createPostAction} type="button">
//               <HiOutlineLocationMarker size={20} />
//                 Location
//               </button>
//             </div>
//           </div>

//           <div className={styles.createPostFooter}>
//             <button
//               className={styles.cancelButton}
//               onClick={() => {
//                 setIsExpanded(false);
//                 setContent("");
//                 setImage(null);
//                 setImagePreview(null);
//               }}
//               disabled={isSubmitting}
//             >
//               Cancel
//             </button>
//             <button
//               className={styles.postButton}
//               onClick={handleSubmit}
//               disabled={isSubmitting || (!content.trim() && !image)}
//             >
//               {isSubmitting ? "Posting..." : "Post"}
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

const CreatePost = () => {
   const currentUser = {
    id: 1,
    avatar: "",
    firstName: "test",
    lastName: "test",
  };



  // start fix create post 

  const [showPopup, setShowPopup] = useState(false);
  const [showPopupFollowers, setShowPopupFollowers] = useState(false);
  const [selectedFollowers, setSelectedFollowers] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedPrivacy, setSelectedPrivacy] = useState('public');
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

  // manage popup select followers
  const handleInputClickPrivate = () => {
    setShowPopupFollowers(true);
  };

  const closePopupPrivate = () => {
    setShowPopupFollowers(false);
  };

  const cancelButton = () => {
    closePopupPrivate()
     selectPrivacy('public')
  }

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

  //  manage popup options who can see post
  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const closeOptions = () => {
    setShowOptions(false);
  }
  const selectPrivacy = (privacy) => {
    setSelectedPrivacy(privacy);
    setShowOptions(false);

    if (privacy === 'private') {
      handleInputClickPrivate();
    }
  };

  // Get display text for the button
  const getDisplayText = () => {
    switch (selectedPrivacy) {
      case 'public': return 'Public';
      case 'almostPrivate': return 'Followers';
      case 'private': return selectedFollowers.length > 0 
      ? `Selected (${selectedFollowers.length})` 
      : 'Public';
      default: return 'Public';
    }
  };

  // Get icon for the button
  const getPrivacyIcon = () => {
    switch (selectedPrivacy) {
      case 'public': return '🌎';
      case 'almostPrivate': return '👥';
      case 'private':  return selectedFollowers.length > 0 ? '🔒' : '🌎'
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

return(
    <div className={styles.postForm}>
          <div className={styles.createPost}>
            <div className={styles.createPostHeader}>
              <img
                // src={currentUser.avatar || "https://i.pravatar.cc/150?u=10"}
                className={styles.createPostAvatar}
              />
              {/* <div> */}
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
            <div className={styles.buttonContainer}>
              <button className={styles.createPostAction}>
                <BsImage size={20} />
                Photo/GIF
              </button>
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
                    <span className={styles.closeButtoOptions} onClick={closeOptions}>&times;</span>
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
            </div>


            {/* Follower Selection Popup */}
            {showPopupFollowers && (
              <div className={styles.popupOverlay}>
                <div className={styles.popupContainer}>
                  <div className={styles.popupHeader}>
                    <h3 className={styles.popupTitle}>Select Followers :</h3>
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
                      onClick={cancelButton}
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
            <button
              className={styles.postButton}>

              post
            </button>
          </div>
        </div>
        )
}

export default CreatePost