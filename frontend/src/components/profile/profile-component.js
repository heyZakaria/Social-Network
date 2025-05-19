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

  //   {
  //     "id": "2bab197e-fc65-426e-8227-ae60182b8b41",
  //     "firstName": "AMine",
  //     "lastName": "Habchi",
  //     "email": "xxcxc@sdf.comx",
  //     "nickname": "zcxasa",
  //     "bio": "",
  //     "avatar": "./uploads/profile_image/b9d82136-6c8b-4c35-9874-206adc84633c.JPEG",
  //     "profile_status": "public",
  //     "birthday": "2000-05-05T00:00:00Z",
  //     "created_at": "2025-05-13T17:47:47Z",
  //     "followerCount": 0,
  //     "followingCount": 0,
  //     "posts": null,
  //     "followers": null,
  //     "following": null
  // }
  console.log("ProfileData.avatar:", ProfileData.avatar);


  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <div className={styles.profileCover}>
          <img
            src={"http://localhost:8080/" + ProfileData.avatar}// ./uploads/profile_image/b27c2604-404b-48e4-a20c-f4afa29a9c57.jpeg
            alt="Cover"
            onError={(e) => {
              e.currentTarget.onerror = null; // Prevent infinite loop if fallback also fails
              e.currentTarget.src = 'http://localhost:8080/uploads/profile_image/b27c2604-404b-48e4-a20c-f4afa29a9c57.jpeg';
            }}
            className={styles.coverImage}
          />
        </div>
        <div className={styles.profileInfo}>
          <div className={styles.profileAvatar}>
            <img
              src={"http://localhost:8080/" + ProfileData.avatar || "https://cdn.pixabay.com/photo/2018/04/18/18/56/user-3331256_1280.png" }
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

            {ProfileData.aboutMe && ( // TODO Change the logic
              <div className={styles.profileBio}>{ProfileData.aboutMe}</div>
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
            {/* {activeTab === "posts" && (
              <div className={styles.postsGrid}>
                {posts.length > 0 ? (
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
            )} */}

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
