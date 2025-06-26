"use client";

import { useState, useEffect } from "react";
// import Link from "next/link";
import styles from "@/styles/profile.module.css";
import PostComponent from "@/components/posts/post-component";
import UserList from "../friends/user-list";
import FloatingChat from "@/components/chat/floating-chat";
import Image from "next/image";
import { FaLock } from "react-icons/fa";
import usePosts from "@/hooks/usePosts";
import PostFeeds from "../posts/posts-feed";
import { useUser } from "@/context/user_context";
export default function ProfileComponent({ ProfileData }) {
  const [activeTab, setActiveTab] = useState("posts");

  const { user: currentUser } = useUser()

  const { posts, loading, hasMore, loadMore } = usePosts({
  groupId: null,
  ProfileId: ProfileData ? ProfileData.id : null,
  limit: 10,
});

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <div className={styles.profileCover}>
          <Image width={200} height={100}
            src={ProfileData.avatar || "/uploads/profile.jpeg"} // ./uploads/profile_image/b27c2604-404b-48e4-a20c-f4afa29a9c57.jpeg
            alt="Cover"
            className={styles.coverImage}
          />
        </div>
        <div className={styles.profileInfo}>
          <div className={styles.profileAvatar}>
            <Image width={200} height={100}
              src={ProfileData.avatar || "/uploads/profile.jpeg"}
              alt="Profile Avatar"
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
              <FloatingChat currentUser={currentUser} profileData={ProfileData} source="profile" />

            </div>
            
            <div className={styles.profileStats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>
                  {ProfileData.postsCount}
                </span>{" "}
                posts
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>
                  {ProfileData.followerCount}
                </span>{" "}
                followers
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>
                  {ProfileData.followingCount}
                </span>{" "}
                following
              </div>
            </div>
            {ProfileData.bio && ( // TODO Change the logic
              <div className={styles.profileBio}>{ProfileData.bio}</div>
            )}
            <div>
              {ProfileData.CanView ? (
                <>
                  Email: {ProfileData.email}<br></br>
                  Birthday: {new Date(ProfileData.birthday).toLocaleDateString()}
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>

      {ProfileData.CanView ? (
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
              <PostFeeds
                posts={posts}
                loading={loading}
                loadMore={loadMore}
                hasMore={hasMore}
                currentUser={ProfileData}
              ></PostFeeds>
            )}

            {activeTab === "followers" && (
              <UserList type="followers" users={ProfileData.followers} />
            )}

            {activeTab === "following" && (
              <UserList type="following" users={ProfileData.following} />
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
      {/* <FloatingChat currentUser={ProfileData} /> */}
    </div>
  );
}
