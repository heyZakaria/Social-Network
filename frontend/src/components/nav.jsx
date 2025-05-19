"use client";

import Link from "next/link";
import styles from "@/styles/navbar.module.css";
import { usePathname } from "next/navigation";

export default function Nav() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <div className={styles.navbarLogo}>
          <Link href="/" className={styles.logoLink}>
            <span className={styles.logoText}>ConnectHub</span>
          </Link>
        </div>

        <div className={styles.navbarAuth}>
          <Link href="/login" className={styles.loginButton}>
            Log In
          </Link>
          <Link href="/register" className={styles.registerButton}>
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
