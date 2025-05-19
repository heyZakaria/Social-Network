"use client";

import { useState } from "react";
import styles from "@/styles/home.module.css";
import { BsImage } from "react-icons/bs";
import { MdOutlineMood } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";
import PostComponent from "@/components/posts/post-component";
import FloatingChat from "@/components/chat/floating-chat";
// import { getCurrentUser } from "@/app/(auth)/(utils)/api"


export default function Home() {
  // const current = await getCurrentUser()
  // console.log("-------", current);
  
  // if (!currentUser) {
  //   // This should be handled by middleware, but just in case
  //   return notFound()
  // }
  const currentUser = {
    id: 1,
    avatar: "",
    firstName: "test",
    lastName: "test",
  };

  const [posts] = useState([
    {
      id: 1,
      content:
        "Just finished a 10-mile hike in the mountains. The views were breathtaking! 🏔️",
      image:
        "https://imgs.search.brave.com/jLfYC2vnVrdKM1pTa5AmFzHt4c7QNiv3c6zQe-UtXoA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcm9t/by5jb20vdG9vbHMv/aW1hZ2UtcmVzaXpl/ci9zdGF0aWMvUGF0/dGVybl9pbWFnZS04/YzA1MDA1M2VhYjg4/NGU1MWI4NTk5NjA3/ODY1ZDExMi5qcGc",
      createdAt: new Date().toISOString(),
      likes: [],
      comments: [],
      privacy: "public",
      user: {
        id: 2,
        firstName: "John",
        lastName: "Doe",
        avatar: "https://i.pravatar.cc/150?u=10",
      },
    },
    {
      id: 2,
      content:
        "Check out this amazing sunset I captured yesterday evening. #photography #sunset",
      image:
        "https://imgs.search.brave.com/jLfYC2vnVrdKM1pTa5AmFzHt4c7QNiv3c6zQe-UtXoA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcm9t/by5jb20vdG9vbHMv/aW1hZ2UtcmVzaXpl/ci9zdGF0aWMvUGF0/dGVybl9pbWFnZS04/YzA1MDA1M2VhYjg4/NGU1MWI4NTk5NjA3/ODY1ZDExMi5qcGc",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      likes: [],
      comments: [],
      privacy: "public",
      user: {
        id: 3,
        firstName: "Jane",
        lastName: "Smith",
        avatar: "https://i.pravatar.cc/150?u=11",
      },
    },
  ]);

  return (
    <div className={styles.homePage}>
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
              {/* <button className={styles.createPostAction}>
                <MdOutlineMood size={20} />
                Feeling/Activity
              </button> */}
              {/* <button className={styles.createPostAction}>
                <HiOutlineLocationMarker size={20} />
                Location
              </button> */}
            </div>
          </div>

          <div className={styles.feed}>
            {posts.map((post) => (
              <PostComponent
                key={post.id}
                post={post}
                user={post.user}
                currentUser={currentUser}
              />
            ))}
          </div>
        </div>
      </div>
      <FloatingChat currentUser={currentUser} />
    </div>
  );
}
