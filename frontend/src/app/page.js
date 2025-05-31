// import Image from "next/image";
// import styles from "./page.module.css";
// import NavBar from "@/components/navbar";

// export default function Home() {
//   return <>
//   </>
// }

import { getCurrentUser } from "./actions/auth";
import Link from "next/link";
import styles from "../styles/home.module.css";
import Sidebar from "@/components/sidebar";
import { HiChatBubbleLeftRight, HiBell, HiCog6Tooth } from "react-icons/hi2";

export default async function Home() {
  
  return (
    <div className={styles.homePage}>
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
          <img
            src="https://imgs.search.brave.com/jLfYC2vnVrdKM1pTa5AmFzHt4c7QNiv3c6zQe-UtXoA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcm9t/by5jb20vdG9vbHMv/aW1hZ2UtcmVzaXpl/ci9zdGF0aWMvUGF0/dGVybl9pbWFnZS04/YzA1MDA1M2VhYjg4/NGU1MWI4NTk5NjA3/ODY1ZDExMi5qcGc"
            alt="ConnectHub"
          />
        </div>
      </div>
    </div>
  );
}
