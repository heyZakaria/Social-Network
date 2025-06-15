"use client";

import { useState, useRef } from 'react';
import { BsImage } from 'react-icons/bs';
import styles from '@/styles/posts.module.css';
import PopupInput from './popup-input';
import PopupPrivacy from './popup-privacy';
import { useUser } from "@/context/user_context";
import Image from "next/image";


const CreatePost = ({ Refrech}) => {
  // State for form data  
  const {user : currentUser} = useUser()
  const [postContent, setPostContent] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [selectedImage, setSelectedImage] = useState(null);
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);  

  // State for errors
  const [errors, setErrors] = useState({
    content: '',
    privacy: '',
    image: ''
  });

  const fileInputRef = useRef(null);

  // Clear all errors
  const clearErrors = () => {
    setErrors({
      content: '',
      privacy: '',
      image: ''
    });
  };

  // Validation function
  const validateForm = () => {

    let isValid = true;
    const newErrors = {
      content: '',
      privacy: '',
      image: ''
    };

    // Clear existing errors first
    clearErrors();

    // Validate post content
    if (postContent) {
      if (postContent.length > 10000) {
        newErrors.content = 'Maximum 10000 characters.';
        isValid = false;
      }
      if (!postContent.trim()) {
        newErrors.content = 'Post content is required.';
        isValid = false;
      }
    }

    // Validate privacy settings
    const validPrivacyOptions = ['public', 'followers', 'custom_users'];
    if (!validPrivacyOptions.includes(privacy)) {
      newErrors.privacy = 'Please select a valid privacy option.';
      isValid = false;
    }

    // Validate custom users selection
    if (privacy === 'custom_users' && allowedUsers.length === 0) {
      newErrors.privacy = 'Please select users for custom privacy.';
      isValid = false;
    }

    // Validate image if selected
    if (selectedImage) {
      if (!selectedImage.type.startsWith('image/')) {
        newErrors.image = 'Please select a valid image file.';
        isValid = false;
      }
      if (selectedImage.size > 10 * 1024 * 1024) {
        newErrors.image = 'Image size should be less than 10MB.';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Reset form after successful submission
  const resetForm = () => {
    setPostContent('');
    setSelectedImage(null);
    setPrivacy('public');
    setAllowedUsers([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    clearErrors();
  };

  const publishPost = async (event) => {
    event.preventDefault();

    // Validation
    const isValid = validateForm();

    if (isValid) {
      setIsLoading(true);

      try {
        // Create FormData for multipart form submission
        const formData = new FormData();
        ;
        formData.append('post_privacy', privacy);

        if ((selectedImage) && (postContent)) {
          formData.append('post_image', selectedImage)
          formData.append('post_content', postContent.trim())
          // console.log("both");

        } else if (selectedImage) {
          formData.append('post_image', selectedImage)
          // console.log("only image");

        } else {
          formData.append('post_content', postContent.trim())
          // console.log("only post content");
        }

        // Add allowed users for custom privacy
        if (privacy === 'custom_users') {
          allowedUsers.forEach(userId => {
            formData.append('allowed_users', userId);
          });
        }

        const response = await fetch('/api/posts/createpost', {
          method: 'POST',
          credentials: 'include', // This sends cookies with the request
          body: formData,
        });

        const data = await response.json();

        if (data.success) {

          // Reset form on success
          resetForm();
          Refrech();
          if (data.error){
             setErrors(prev => ({ ...prev, content:  data.error}));
          }
        } else {
          setErrors(prev => ({ ...prev, content: data.message || 'Failed to create post' }));
        }

      } catch (error) {
        console.error('Error:', error);
        setErrors(prev => ({ ...prev, content: 'Network error. Please try again.' }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle image selection
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Clear any previous image errors
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  // Handle privacy change from PopupPrivacy
  const handlePrivacyChange = (privacyValue, selectedFollowers = []) => {
    // Map privacy values from PopupPrivacy to backend expected values
    const privacyMap = {
      'public': 'public',
      'almostPrivate': 'followers',
      'private': 'custom_users'
    };

    const mappedPrivacy = privacyMap[privacyValue] || 'public';
    setPrivacy(mappedPrivacy);

    if (mappedPrivacy === 'custom_users') {
      setAllowedUsers(selectedFollowers.map(id => id.toString()));
    } else {
      setAllowedUsers([]);
    }

    // Clear privacy errors
    setErrors(prev => ({ ...prev, privacy: '' }));
  };

  // Handle content change from PopupInput
  const handleContentChange = (content) => {
    setPostContent(content);
    // Clear content errors
    setErrors(prev => ({ ...prev, content: '' }));
  };
  
  return (
    <form onSubmit={publishPost} className={styles.postForm} id="postForm">
      <div className={styles.createPost}>
        <div className={styles.createPostHeader}>
          <Image width={200} height={100}
            src={ currentUser.avatar || "/uploads/profile.jpeg"}
            alt="User Avatar"
            className={styles.createPostAvatar}
          />
          <PopupInput
            postContent={postContent}
            onContentChange={handleContentChange}
            currentUser={currentUser}
          // disabled={isLoading}
          />
        </div>
      </div>

      {/* Error Messages */}
      {(errors.content) && (
        <div id="content-error" className={styles.errorMessage}>
          {errors.content}
        </div>
      )}

      {errors.privacy && (
        <div id="privacy-error" className={styles.errorMessage}>
          {errors.privacy}
        </div>
      )}

      {/* Selected Image Preview */}
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
              setErrors(prev => ({ ...prev, image: '' }));
            }}
            className={styles.removeImageButton}
            type="button"
            disabled={isLoading}
          >
            ×
          </button>
        </div>
      )}

      <div className={styles.buttons}>
        <div className={styles.buttonContainer}>
          <button
            className={styles.photoAction}
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            type="button"
          >
            <BsImage size={20} />
            Photo/GIF
          </button>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            style={{ display: 'none' }}
          />

          <PopupPrivacy
            followers={currentUser.followers || []}
            onPrivacyChange={handlePrivacyChange}
            disabled={isLoading}
          />
        </div>

        <button
          className={styles.postButton}
          type="submit"
        >
          {isLoading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </form>
  );
};

export default CreatePost;