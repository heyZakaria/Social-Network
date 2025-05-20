"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "@/styles/profile.module.css";
import PostComponent from "@/components/posts/post-component";
import FollowButton from "./follow-button";
import PrivacyToggle from "./privacy-toggle";
import UserList from "./user-list";
import FloatingChat from "@/components/chat/floating-chat";
import { FaLock } from "react-icons/fa";
// ProfileData={{
//   profileUser
// }}
export default function ProfileComponent({
  ProfileData,
  canView,
  // posts,
  // followers,
  // following,
}) {
  const [activeTab, setActiveTab] = useState("posts");
  // const ProfileData.isOwnProfile = currentUser.id === currentUser.id;
  // if (ProfileData.isOwnProfile) {
  //   currentUser = currentUser
  // }


  console.log("ProfileData.avatar:", ProfileData.avatar);
 

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <div className={styles.profileCover}>
          <img
            src={ProfileData.avatar || "/uploads/profile.jpeg"}// ./uploads/profile_image/b27c2604-404b-48e4-a20c-f4afa29a9c57.jpeg
            alt="Cover"
            className={styles.coverImage}
          />
        </div>
        <div className={styles.profileInfo}>
          <div className={styles.profileAvatar}>
            <img
              src={ProfileData.avatar || "/uploads/profile.jpeg"}
              alt={ProfileData.FirstName}
              className={styles.avatarImage}
            />
          </div>

          <div className={styles.profileDetails}>
            <div className={styles.profileNameSection}>
              <h1 className={styles.profileName}>
                {ProfileData.firstName} {ProfileData.lastName}
                {ProfileData.nickname && (
                  <span className={styles.nickname}>
                    ({ProfileData.nickname})
                  </span>
                )}
              </h1>

              {ProfileData.isOwnProfile ? (
                <div className={styles.profileActions}>
                  <Link href="/settings" className={styles.editButton}>
                    Edit Profile
                  </Link>

                  <PrivacyToggle user={ProfileData} />
                </div>
              ) : (
                <div className={styles.profileActions}>
                  <FollowButton
                    currentUser={ProfileData}
                  // currentUser={currentUser}
                  />
                  <button className={styles.messageButton}>Message</button>
                </div>
              )}
            </div>

            <div className={styles.profileStats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{ProfileData.posts}</span> posts
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{ProfileData.followerCount}</span>{" "}
                followers
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{ProfileData.followingCount}</span>{" "}
                following
              </div>
            </div>

            {ProfileData.bio && ( // TODO Change the logic
              <div className={styles.profileBio}>{ProfileData.bio}</div>
            )}
          </div>
        </div>
      </div>

      {canView ? (
        <div className={styles.profileContent}>
          <div className={styles.profileTabs}>
            <button
              className={`${styles.tabButton} ${activeTab === "posts" ? styles.activeTab : ""
                }`}
              onClick={() => setActiveTab("posts")}
            >
              Posts
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === "followers" ? styles.activeTab : ""
                }`}
              onClick={() => setActiveTab("followers")}
            >
              Followers
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === "following" ? styles.activeTab : ""
                }`}
              onClick={() => setActiveTab("following")}
            >
              Following
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === "posts" && (
              <div className={styles.postsGrid}>
                {ProfileData.post > 0 ? (
                  posts.map((post) => (
                    <PostComponent
                      key={post.id}
                      post={post}
                      user={currentUser}
                      currentUser={currentUser}
                    />
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    <p>No posts yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "followers" && (
              <UserList users={followers} currentUser={currentUser} />
            )}

            {activeTab === "following" && (
              <UserList users={following} currentUser={currentUser} />
            )}
          </div>
        </div>
      ) : (
        <div className={styles.privateProfile}>
          <div className={styles.privateIcon}>
            <FaLock size={48} />
          </div>
          <h2>This Account is Private</h2>
          <p>Follow this account to see their photos and posts</p>
        </div>
      )}

      {/* Always visible floating chat */}
      <FloatingChat currentUser={ProfileData} />
    </div>
  );
}
