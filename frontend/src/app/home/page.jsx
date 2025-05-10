// import Image from "next/image";
// import styles from "./page.module.css";
// import NavBar from "@/components/navbar";

// export default function Home() {
//   return <>
//   </>
// }

// import { getCurrentUser } from "./actions/auth";
import Link from "next/link";
import styles from "@/styles/home.module.css";
import Sidebar from "@/components/sidebar"; 
import * as h2 from "react-icons/hi";
import { BsImage } from 'react-icons/bs';
import { IoHeartOutline } from 'react-icons/io5';
import { BiShare, BiComment } from 'react-icons/bi';
import { MdOutlineMood } from 'react-icons/md';
import { HiOutlineLocationMarker } from 'react-icons/hi';
// import { HiMapPin, HiUserGroup, HiBell, HiMessage } from "react-icons/hi";
import { HiMapPin, HiUserGroup, HiBell, HiChat } from "react-icons/hi2";
console.log(h2);

export default async function Home() {
//   const user = await getCurrentUser();
const user = {
    avatar : "",
    firstName: "test",
    lastName: "test",
}

  return (
    <div className={styles.homePage}>
      {/* {!user ? (
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Connect<span className={styles.highlight}>Hub</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Connect with friends, share moments, and build your community.
            </p>
            <div className={styles.heroButtons}>
              <Link href="/register" className={styles.primaryButton}>
                Get Started
              </Link>
              <Link href="/login" className={styles.secondaryButton}>
                Log In
              </Link>
            </div>
          </div>
          <div className={styles.heroImage}>
            <img src="/placeholder.svg?height=400&width=500" alt="ConnectHub" />
          </div>
        </div>
      ) : ( */}
        <div className={styles.mainContent}>
          <div className={styles.contentArea}>
            <div className={styles.createPost}>
              <div className={styles.createPostHeader}>
                <img
                  src={user.avatar || "https://i.pravatar.cc/150?u=10"}
                  alt={user.firstName}
                  className={styles.createPostAvatar}
                />
                <input
                  type="text"
                  placeholder={`What's on your mind, ${user.firstName}?`}
                  className={styles.createPostInput}
                />
              </div>
              <div className={styles.createPostActions}>
                <button className={styles.createPostAction}>
                <BsImage size={20} />
                  Photo/GIF
                </button>
                <button className={styles.createPostAction}>
                <MdOutlineMood size={20} />
                  Feeling/Activity
                </button>
                <button className={styles.createPostAction}>
                <HiOutlineLocationMarker size={20} />
                  Location
                </button>
              </div>
            </div>

            <div className={styles.feed}>
              {/* Sample posts */}
              <div className={styles.post}>
                <div className={styles.postHeader}>
                  <img
                    src="https://i.pravatar.cc/150?u=10"
                    alt="John Doe"
                    className={styles.postAvatar}
                  />
                  <div className={styles.postInfo}>
                    <div className={styles.postUser}>John Doe</div>
                    <div className={styles.postTime}>2 hours ago</div>
                  </div>
                </div>
                <div className={styles.postContent}>
                  <p>
                    Just finished a 10-mile hike in the mountains. The views
                    were breathtaking! 🏔️
                  </p>
                  <img
                    src="https://imgs.search.brave.com/jLfYC2vnVrdKM1pTa5AmFzHt4c7QNiv3c6zQe-UtXoA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcm9t/by5jb20vdG9vbHMv/aW1hZ2UtcmVzaXpl/ci9zdGF0aWMvUGF0/dGVybl9pbWFnZS04/YzA1MDA1M2VhYjg4/NGU1MWI4NTk5NjA3/ODY1ZDExMi5qcGc"
                    alt="Mountain view"
                    className={styles.postImage}
                  />
                </div>
                <div className={styles.postActions}>
                  <button className={styles.postAction}>
                  <IoHeartOutline size={20} />
                    Like
                  </button>
                  <button className={styles.postAction}>
                  <BiComment size={20} />
                    Comment
                  </button>
                  <button className={styles.postAction}>
                  <BiShare size={20} />
                    Share
                  </button>
                </div>
              </div>

              <div className={styles.post}>
                <div className={styles.postHeader}>
                  <img
                    src="https://i.pravatar.cc/150?u=10"
                    alt="Jane Smith"
                    className={styles.postAvatar}
                  />
                  <div className={styles.postInfo}>
                    <div className={styles.postUser}>Jane Smith</div>
                    <div className={styles.postTime}>Yesterday</div>
                  </div>
                </div>
                <div className={styles.postContent}>
                  <p>
                    Check out this amazing sunset I captured yesterday evening.
                    #photography #sunset
                  </p>
                  <img
                    src="https://imgs.search.brave.com/jLfYC2vnVrdKM1pTa5AmFzHt4c7QNiv3c6zQe-UtXoA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcm9t/by5jb20vdG9vbHMv/aW1hZ2UtcmVzaXpl/ci9zdGF0aWMvUGF0/dGVybl9pbWFnZS04/YzA1MDA1M2VhYjg4/NGU1MWI4NTk5NjA3/ODY1ZDExMi5qcGc"
                    alt="Sunset"
                    className={styles.postImage}
                  />
                </div>
                <div className={styles.postActions}>
                  <button className={styles.postAction}>
                  <IoHeartOutline size={20} />
                    Like
                  </button>
                  <button className={styles.postAction}>
                  <BiComment size={20} />
                    Comment
                  </button>
                  <button className={styles.postAction}>
                  <BiShare size={20} />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/* )} */}
    </div>
  );
}
