"use client";

import { useState } from "react";
import styles from "@/styles/home.module.css";
import { BsImage } from "react-icons/bs";
import { MdOutlineMood } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";
import PostComponent from "@/components/posts/post-component";
import FloatingChat from "@/components/chat/floating-chat";
import CreatePost from "@/components/posts/create-post";
export default function Home() {
   const [posts] = useState([
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

     const currentUser = {
    id: 1,
    avatar: "",
    firstName: "test",
    lastName: "test",
  };
  return (
    <div className={styles.homePage}>
      <div className={styles.mainContent}>
        <CreatePost />

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

      {/* </div> */}
      <FloatingChat currentUser={currentUser} />
    </div>
  );


}
