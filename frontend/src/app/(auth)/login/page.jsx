"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/login.module.css";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user_context";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("omar@gmail.com");
  const [password, setPassword] = useState("Abcd1234");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerErrors] = useState("");
  const { user: currentUser, fetchUser } = useUser();

if (currentUser) {
  useEffect(() => {
    router.push("/");
  }, [router]);
  return  <div>Redirecting...</div>;
}

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerErrors("");
    setLoading(true);

    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });


      const data = await res.json();

      if (!res.ok) {
        setServerErrors(data.error || "Login failed");
        setLoading(false);
        return;
      }
      if (res.ok && data.success) {
        await fetchUser();
        router.push("/");
      } else {
        setServerErrors(data.error || "Login failed");
      }
    } catch (error) {
      setServerErrors("Something went wrong");
      setLoading(false);
    }
  };
  if (loading) return <div>Loading...</div>;

  return (

    <div className={styles.loginContainer}>
      <h2 className={styles.heading3}>Sign In</h2>
      <p className={styles.subtitle}>
        Don't have an account?{" "}
        <Link href="/register" className={styles.subtitleLink}>
          Register
        </Link>
      </p>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.inputEmail}
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.inputPassword}
          />
          {errors.password && <p className={styles.error}>{errors.password}</p>}
        </div>
        {serverError && (
          <p className={`${styles.error} ${styles.serverError}`}>
            {serverError}
          </p>
        )}
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
