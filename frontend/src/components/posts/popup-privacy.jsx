"use client";

import styles from "@/styles/posts.module.css";
import { useState } from "react";

const PopupPrivacy = ({ followers, onPrivacyChange, disabled = false }) => {
    const [showPopupFollowers, setShowPopupFollowers] = useState(false);
    const [selectedFollowers, setSelectedFollowers] = useState([]);
    const [showOptions, setShowOptions] = useState(false);
    const [selectedPrivacy, setSelectedPrivacy] = useState('public');

    // manage popup select followers
    const handleInputClickPrivate = () => {
        setShowPopupFollowers(true);
    };

    const closePopupPrivate = () => {
        setShowPopupFollowers(false);
    };

    const cancelButton = () => {
        closePopupPrivate();
        selectPrivacy('public');
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
        // Notify parent component about privacy and selected followers
        onPrivacyChange?.(selectedPrivacy, selectedFollowers);
    };

    //  manage popup options who can see post
    const toggleOptions = () => {
        setShowOptions(!showOptions);
    };

    const closeOptions = () => {
        setShowOptions(false);
    };

    const selectPrivacy = (privacy) => {

        setSelectedPrivacy(privacy);
        setShowOptions(false);

        if (privacy === 'private') {
            handleInputClickPrivate();
        } else {
            // For public and almostPrivate, immediately notify parent
            onPrivacyChange?.(privacy, []);
            setSelectedFollowers([]); // Clear selected followers for non-private options
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
            case 'private': return selectedFollowers.length > 0 ? '🔒' : '🌎'
            default: return '🌎';
        }
    };

    return (
        <div>
            <button
                onClick={toggleOptions}
                className={styles.privacyButton}
                type="button"
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
                            type="button"
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
                            type="button"
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
                            type="button"
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

            {/* select followers you want to see post */}
            {showPopupFollowers && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popupContainer}>
                        <div className={styles.popupHeader}>
                            <h3 className={styles.popupTitle}>Select Followers :</h3>
                        </div>

                        <div className={styles.followersList}>
                            {followers.length == 0 ? "You don't have any followers..." : 
                                followers.map(follower => (
                                    <div key={follower.id} className={styles.followerItem}>
                                        <input
                                            type="checkbox"
                                            id={`follower-${follower.id}`}
                                            checked={selectedFollowers.includes(follower.id)}
                                            onChange={() => toggleFollower(follower.id)}
                                            className={styles.followerCheckbox}
                                        />
                                        <Image width={} height={} src={follower.avatar || "/uploads/profile.jpeg"} alt={follower.firstName +" "+ follower.lastName} className={styles.followerAvatar} />
                                        <label htmlFor={`follower-${follower.id}`} className={styles.followerName}>
                                            {follower.firstName +" "+ follower.lastName}
                                        </label>
                                    </div>
                                ))
                            }
                        </div>

                        <div className={styles.popupFooter}>
                            <button
                                onClick={cancelButton}
                                className={styles.cancelButton}
                                type="button"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveSelectedFollowers}
                                className={styles.saveButton}
                                type="button"
                                disabled={disabled || (selectedPrivacy === 'private' && selectedFollowers.length === 0)}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PopupPrivacy;