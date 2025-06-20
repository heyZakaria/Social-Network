"use client";

import { useState, useEffect } from "react";
// import Link from "next/link";
import styles from "@/styles/profile.module.css";
import PostComponent from "@/components/posts/post-component";
import FollowButton from "./follow-button";
import PrivacyToggle from "./privacy-toggle";
import UserList from "../friends/user-list";
import FloatingChat from "@/components/chat/floating-chat";
import Image from "next/image";
import { FaLock } from "react-icons/fa";
import usePosts from "@/hooks/usePosts";
import PostFeeds from "../posts/posts-feed";
export default function ProfileComponent({ ProfileData }) {
  const [activeTab, setActiveTab] = useState("posts");
  if (!ProfileData) {
    return <div>Loading...</div>;
  }
  const {posts , loading , hasMore , loadMore } = usePosts({groupId:null , ProfileId:ProfileData.id , limit:10})

  // const [posts, setPosts] = useState([]);
  // const [offset, setOffset] = useState(0);
  // const limit = 10; // You can change this value if needed
  // const [loading, setLoading] = useState(false);
  // const [hasMore, setHasMore] = useState(true); // for pagination

//   useEffect(() => {
//     async function fetchPosts() {
//       setLoading(true);
//       try {
//         const data = await FetchData(`/api/posts/getposts?limit=${limit}&offset=${offset}&user_id=${ProfileData.id}`);
//         if (data.success === false) {
//           setHasMore(false);
//           setLoading(false);
//           return
//         }
//         if (data.data.posts.length < limit) setHasMore(false); // no more posts
//         setPosts((prev) => {
//           const existingIds = new Set(prev.map((p) => p.PostId));
//           const uniqueNewPosts = data.data.posts.filter((p) => !existingIds.has(p.PostId));
//           return [...prev, ...uniqueNewPosts];
//         });
//       } finally {
//         setLoading(false);
//       }
//     }
//     if (activeTab === "posts" && hasMore) {
//       fetchPosts();
//     }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [activeTab, offset, ProfileData.id]);

//   console.log("Followers:", ProfileData.followers);
// console.log("Following:", ProfileData.following);

//   const loadMore = () => {
//     if (!loading && hasMore) {
//       setOffset((prev) => prev + limit);
//     }
//   };

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

              {ProfileData.IsOwnProfile ? (
                <div className={styles.profileActions}>
                  {/* <Link href="/settings" className={styles.editButton}>
                    Edit Profile
                  </Link> */}

                  <PrivacyToggle user={ProfileData} />
                </div>
              ) : (
                <div className={styles.profileActions}>
                  <FollowButton targetUserId={ProfileData.id} />
                  {ProfileData.profile_status === "public" ||
                    ProfileData.CanView ? (
                    <button className={styles.messageButton}>Message</button>
                  ) : null}
                </div>
              )}
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
              // <div className={styles.postsGrid}>
              //   {loading && posts.length === 0 ? (
              //     <p>{loading}Loading... {posts.length}</p>
              //   ) : posts.length > 0 ? (
              //     <>
              //       {posts.map((post) => (
              //         <PostComponent
              //           key={post.PostId}
              //           post={post}
              //           user={ProfileData} // or actual logged in user
              //           currentUser={ProfileData}
              //         />
              //       ))}
              //       {hasMore && (
              //         <button
              //           className={styles.loadMoreButton}
              //           onClick={loadMore}
              //           disabled={loading}
              //         >
              //           {loading ? "Loading..." : "Load More"}
              //         </button>
              //       )}
              //     </>
              //   ) : (
              //     <div className={styles.emptyState}>
              //       <p>No posts yet</p>
              //     </div>
              //   )}
              // </div>
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
      <FloatingChat currentUser={ProfileData} />
    </div>
  );
}
