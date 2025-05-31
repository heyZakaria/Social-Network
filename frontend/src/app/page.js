"use client";

import { useEffect } from "react";
import styles from "@/styles/home.module.css";
import { BsImage } from "react-icons/bs";
import FloatingChat from "@/components/chat/floating-chat";
import { useUser } from "@/context/user_context";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user: currentUser } = useUser();
  // const router = useRouter();

  // useEffect(() => {
  //   if (!currentUser) {
  //     router.push("/");
  //   }
  // }, [currentUser, router]);

  return (
    <div className={styles.homePage}>
      {currentUser ? (
        <>
          <div className={styles.mainContent}>
            <div className={styles.contentArea}>
              <div className={styles.createPost}>
                <div className={styles.createPostHeader}>
                  <img
                    src={currentUser.avatar || "https://i.pravatar.cc/150?u=10"}
                    alt={currentUser.firstName}
                    className={styles.createPostAvatar}
                  />
                  <input
                    type="text"
                    placeholder={`What's on your mind, ${currentUser.firstName}?`}
                    className={styles.createPostInput}
                  />
                </div>
                <div className={styles.createPostActions}>
                  <button className={styles.createPostAction}>
                    <BsImage size={20} />
                    Photo/GIF
                  </button>
                </div>
              </div>

              <div className={styles.feed}>

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
            <img
              src="https://imgs.search.brave.com/jLfYC2vnVrdKM1pTa5AmFzHt4c7QNiv3c6zQe-UtXoA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcm9t/by5jb20vdG9vbHMv/aW1hZ2UtcmVzaXpl/ci9zdGF0aWMvUGF0/dGVybl9pbWFnZS04/YzA1MDA1M2VhYjg4/NGU1MWI4NTk5NjA3/ODY1ZDExMi5qcGc"
              alt="ConnectHub"
            />
          </div>
        </div>
      )}
    </div>
  );
}
