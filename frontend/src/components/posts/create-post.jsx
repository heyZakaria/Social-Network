"use client";

import { useState, useRef } from 'react';
import { BsImage } from 'react-icons/bs';
import styles from '@/styles/posts.module.css';
import PopupInput from './popup-input';
import PopupPrivacy from './popup-privacy';

const CreatePost = () => {
  // State for form data
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

  // Handle errors from API response
  const handleErrors = (status) => {
    switch (status) {
      case 400:
        setErrors(prev => ({ ...prev, content: 'Bad request. Please enter text or upload an image !!' }));
        break;
      case 401:
        setErrors(prev => ({ ...prev, content: 'Unauthorized. Please log in again.' }));
        break;
      case 500:
        setErrors(prev => ({ ...prev, content: 'Server error. Please try again later.' }));
        break;
      default:
        setErrors(prev => ({ ...prev, content: 'An error occurred. Please try again.' }));
    }
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

        // Add image if selected
        if ((selectedImage) && (postContent)) {
          formData.append('post_image', selectedImage)
          formData.append('post_content', postContent.trim())
        } else if (selectedImage) {
          formData.append('post_image', selectedImage)
        } else {
          formData.append('post_content', postContent.trim())
        }

        // Add allowed users for custom privacy
        if (privacy === 'custom_users') {
          allowedUsers.forEach(userId => {
            formData.append('allowed_users', userId);
          });
        }

        const response = await fetch('http://localhost:8080/rest/createpost', {
          method: 'POST',
          credentials: 'include', // This sends cookies with the request
          body: formData,
        });
        console.log("response----------", response);


        if (!response.ok) {
          handleErrors(response.status);
          return;
        }

        const data = await response.json();

        if (data.success) {
          console.log('Post =>', data);

          // Reset form on success
          resetForm();

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
          <img
            // src={currentUser.avatar || "https://i.pravatar.cc/150?u=10"}
            className={styles.createPostAvatar}
          />
          <PopupInput
            postContent={postContent}
            onContentChange={handleContentChange}
          // disabled={isLoading}
          />
        </div>
      </div>

      {/* Error Messages */}
      {(errors.content ) && (
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
          <img
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
            onPrivacyChange={handlePrivacyChange}
            disabled={isLoading}
          />
        </div>

        <button
          className={styles.postButton}
          type="submit"
          // disabled={isLoading || !postContent.trim() }
        >
          {isLoading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </form>
  );
};

export default CreatePost;