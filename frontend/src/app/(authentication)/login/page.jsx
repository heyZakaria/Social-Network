import styles from "./login.module.css";
import Link from "next/link";

export default function Login() {
  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.heading3}>Sign In</h2>
      <p className={styles.subtitle}>
        Don't have an account?{" "}
        <Link href="/register" className={styles.subtitleLink}>
          Register
        </Link>
      </p>
      <form className={styles.loginForm}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input type="email" className={styles.inputEmail} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Password</label>
          <input type="password" className={styles.inputPassword} />
        </div>
        {/* Error message example */}
        {/* <p className={`${styles.error} ${styles.serverError}`}>Invalid credentials</p> */}
        <button type="submit" className={styles.submitBtn}>
          Sign In
        </button>
      </form>
    </div>
  );
}
