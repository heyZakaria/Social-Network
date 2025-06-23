"use client";

import Image from "next/image";
import FloatingChat from "@/components/chat/floating-chat";
import { useUser } from "@/context/user_context";
import PostFeeds from "@/components/posts/posts-feed";
import styles from "@/styles/home.module.css";
import usePosts from "@/hooks/usePosts";
import CreatePost from "@/components/posts/create-post";

export default function Home() {
  const { posts, loading, hasMore, loadMore, RefrechPosts } = usePosts()
  const { user: currentUser } = useUser();

  return (
    <div className={styles.homePage}>
      {currentUser ? (
        <>
          <CreatePost Refrech={RefrechPosts}
          />
          <PostFeeds
            posts={posts}
            loading={loading}
            loadMore={loadMore}
            hasMore={hasMore}
            RefrechPosts={RefrechPosts}
            currentUser={currentUser}
          ></PostFeeds>
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
