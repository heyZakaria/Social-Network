"use client";

import { useEffect } from "react";
import styles from "@/styles/home.module.css";
import Image from "next/image";
import FloatingChat from "@/components/chat/floating-chat";
import { useUser } from "@/context/user_context";
import { useRouter } from "next/navigation";
import CreatePost from "@/components/posts/create-post";
import PostComponent from "@/components/posts/post-component";
import { useState } from "react";
import { FetchData } from "@/context/fetchJson";
import usePosts from "@/hooks/usePosts";
export default function Home() {
  const {posts , loading , hasMore , loadMore , RefrechPosts} = usePosts({groupId:null})
    const { user: currentUser } = useUser();
  //   const [posts, setPosts] = useState([]);
  //   const [offset, setOffset] = useState(0);
  //   const limit = 10; // You can change this value if needed
  //   const [loading, setLoading] = useState(false);
  //   const [hasMore, setHasMore] = useState(true); // for pagination
  //   const [refrech, setRefrech] = useState(0);
  //   useEffect(() => {
  //     async function x() {
  //       const data = await FetchData(
  //       `/api/posts/getposts?limit=${limit}&offset=${offset}`
  //     );
  //     if (data.data.posts.length < limit) {
  //       console.log("no more posts", data.data.posts.length);
  //       console.log("no more posts", data.data.posts);

  //       setHasMore(false); // no more posts
  //     }
  //     setPosts((prev) => {
  //       const existingIds = new Set(prev.map((p) => p.PostId));
  //       const uniqueNewPosts = data.data.posts.filter(
  //         (p) => !existingIds.has(p.PostId)
  //       );
  //       const combinedPosts = [...prev, ...uniqueNewPosts];
      
  //       // Sort posts from highest PostId to lowest
  //       combinedPosts.sort((a, b) => b.PostId - a.PostId);
      
  //       return combinedPosts;
  //     });
      
  //     setLoading(false);
  //   }
  //   setLoading(true); // TODO WAiting before setting it true
  //   if (currentUser){
  //     x();
  //   }
  // }, [refrech ,offset]);

  // console.log("posts", posts);
  // console.log("hasMore", hasMore);

  // const loadMore = () => {
  //   if (!loading && hasMore) {
  //     setOffset((prev) => prev + limit);
  //   }
  // };
  // // const router = useRouter();

  // // useEffect(() => {
  // //   if (!currentUser) {
  // //     router.push("/");
  // //   }
  // // }, [currentUser, router]);
  // function RefrechPosts() {
  //   // TODO Fix adding posts without reloading the page
  //   setRefrech((prev) => prev + 1);
  // }
  console.log("Image Component:", Image);

  return (
    <div className={styles.homePage}>
      {currentUser ? (
        <>
          <div className={styles.mainContent}>
            <CreatePost Refrech={RefrechPosts}/>
            <div className={styles.contentArea}>
              <div className={styles.feed}>
                {loading && posts.length === 0 ? (
                  <p>Loading...</p>
                ) : posts.length > 0 ? (
                  <>
                    {posts.map((post) => (
                      <PostComponent
                        key={post.PostId}
                        post={post}
                        user={currentUser} // or actual logged in user
                        currentUser={currentUser}
                      />
                    ))}

                    {hasMore && (
                      <button
                        className={styles.loadMoreButton}
                        onClick={loadMore}
                        disabled={loading}
                      >
                        {loading ? "Loading..." : "Load More"}
                      </button>
                    )}
                  </>
                ) : (
                  <div className={styles.emptyState}>
                    <p>No posts yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <FloatingChat currentUser={currentUser} />
        </>
      ) : (
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Connect<span className={styles.highlight}>Hub</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Connect with friends, share moments, and build your community.
            </p>
            <div className={styles.heroButtons}>
              <a href="/register" className={styles.primaryButton}>
                Get Started
              </a>
              <a href="/login" className={styles.secondaryButton}>
                Log In
              </a>
            </div>
          </div>
          <div className={styles.heroImage}>
            <Image width={600} height={100}
              src="/uploads/background.webp"
              alt="ConnectHub"
            />
          </div>
        </div>
      )}
    </div>
  );
}
