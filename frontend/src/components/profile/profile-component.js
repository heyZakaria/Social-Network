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

export default function ProfileComponent({
  currentUser,
  profileUser,
  canView,
  posts,
  followers,
  following,
}) {
  const [activeTab, setActiveTab] = useState("posts");
  currentUser = {
    id: 1,
    email: "john@example.com",
    password: "password123",
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "1990-05-15",
    nickname: "JD",
    aboutMe: "Software developer and hiking enthusiast",
    avatar: "https://i.pravatar.cc/150?u=100",
    isPublic: true,
    followers: [2, 3],
    following: [2],
    createdAt: "2023-01-15T08:30:00Z",
  };
  const isOwnProfile = currentUser.id === profileUser.id;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <div className={styles.profileCover}>
          <img
            src="https://imgs.search.brave.com/jLfYC2vnVrdKM1pTa5AmFzHt4c7QNiv3c6zQe-UtXoA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcm9t/by5jb20vdG9vbHMv/aW1hZ2UtcmVzaXpl/ci9zdGF0aWMvUGF0/dGVybl9pbWFnZS04/YzA1MDA1M2VhYjg4/NGU1MWI4NTk5NjA3/ODY1ZDExMi5qcGc"
            alt="Cover"
            className={styles.coverImage}
          />
        </div>

        <div className={styles.profileInfo}>
          <div className={styles.profileAvatar}>
            <img
              src="https://imgs.search.brave.com/jLfYC2vnVrdKM1pTa5AmFzHt4c7QNiv3c6zQe-UtXoA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcm9t/by5jb20vdG9vbHMv/aW1hZ2UtcmVzaXpl/ci9zdGF0aWMvUGF0/dGVybl9pbWFnZS04/YzA1MDA1M2VhYjg4/NGU1MWI4NTk5NjA3/ODY1ZDExMi5qcGc"
              alt={profileUser.firstName}
              className={styles.avatarImage}
            />
          </div>

          <div className={styles.profileDetails}>
            <div className={styles.profileNameSection}>
              <h1 className={styles.profileName}>
                {profileUser.firstName} {profileUser.lastName}
                {profileUser.nickname && (
                  <span className={styles.nickname}>
                    ({profileUser.nickname})
                  </span>
                )}
              </h1>

              {isOwnProfile ? (
                <div className={styles.profileActions}>
                  <Link href="/settings" className={styles.editButton}>
                    Edit Profile
                  </Link>
                  <PrivacyToggle user={profileUser} />
                </div>
              ) : (
                <div className={styles.profileActions}>
                  <FollowButton
                    currentUser={currentUser}
                    profileUser={profileUser}
                  />
                  <button className={styles.messageButton}>Message</button>
                </div>
              )}
            </div>

            <div className={styles.profileStats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{posts.length}</span> posts
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{followers.length}</span>{" "}
                followers
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{following.length}</span>{" "}
                following
              </div>
            </div>

            {profileUser.aboutMe && (
              <div className={styles.profileBio}>{profileUser.aboutMe}</div>
            )}
          </div>
        </div>
      </div>

      {canView ? (
        <div className={styles.profileContent}>
          <div className={styles.profileTabs}>
            <button
              className={`${styles.tabButton} ${
                activeTab === "posts" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("posts")}
            >
              Posts
            </button>
            <button
              className={`${styles.tabButton} ${
                activeTab === "followers" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("followers")}
            >
              Followers
            </button>
            <button
              className={`${styles.tabButton} ${
                activeTab === "following" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("following")}
            >
              Following
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === "posts" && (
              <div className={styles.postsGrid}>
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <PostComponent
                      key={post.id}
                      post={post}
                      user={profileUser}
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
      <FloatingChat currentUser={currentUser} />
    </div>
  );
}
