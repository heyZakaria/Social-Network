// client component declaration
// we write this because next work in server
// and make next work in client side
// without this part form validation, onChang && usestate not work
"use client";

// for save what we have in every input
import { useState } from "react";

// we use this import for not reload page
import Link from "next/link";
import { useRouter } from 'next/navigation';
import styles from "./register.module.css";
import { FaTrash } from "react-icons/fa";

// so we need to make this page exportable to use by next
export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    birthday: "",
    nickname: "",
    bio: "",
    avatar: null,
  });

  //err of input len format....
  const [errors, setErrors] = useState({});

  //errors of backend for example if email exist
  const [serverError, setServerError] = useState("");

  const validate = () => {
    let errors = {};
    // valid first.N
    if (formData.firstName.trim().length < 3)
      errors.firstName = "First name too short.";
    if (formData.firstName.trim().length > 20)
      errors.firstName = "First name too long.";

    // valid last.N
    if (formData.lastName.trim().length < 3)
      errors.lastName = "Last name too short.";
    if (formData.lastName.trim().length > 20)
      errors.lastName = "Last name too long.";

    // valid email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) errors.email = "Invalid email.";
    if (formData.email.trim().length > 70) errors.email = "Email too long.";

    // valid password
    if (formData.password.length < 8) errors.password = "Password too short.";
    if (!/[a-z]/.test(formData.password)) errors.password = "Needs lowercase.";
    if (!/[A-Z]/.test(formData.password)) errors.password = "Needs Uppercase.";
    if (!/[0-9]/.test(formData.password)) errors.password = "Needs number.";

    //vald birthday
     //vald birthday
     if (!formData.birthday) {
      errors.birthday = "Birthday required.";
    } else {
      const [year, month, day] = formData.birthday.split("-").map(Number);
      const birth = new Date(year, month - 1, day);
      const today = new Date();

      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      const d = today.getDate() - birth.getDate();

      if (m < 0 || (m === 0 && d < 0)) {
        age--;
      }

      if (age < 15 || age > 120) {
        errors.birthday = "Age must be between 15 and 120.";
      }
    }

    //valid nickname
    if (formData.nickname && !/^[a-zA-Z0-9]+$/.test(formData.nickname))
      errors.nickname = "Only letters, numbers, and underscore.";

    if (formData.avatar) {
      const allowedType = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg",
      ];
      if (!allowedType.includes(formData.avatar.type))
        errors.avatar = "Only jpeg, jpg, png or webp allowed.";
      if (formData.avatar.size > 1024 * 1024) errors.avatar = "Max size 1MB.";
    }

    // valid bio
    if (formData.bio.trim().length > 200) errors.bio = "Bio too long.";

    return errors;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      // take all VALUES
      ...prev,
      // and modif in target to take now value
      [name]: name === "avatar" ? files[0] : value,
    }));
    // give errors to function setErrors to modif
    setErrors((prev) => ({ ...prev, [name]: "" }));

    // make error empty
    // cliwnt maybe solve prob
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // give errors to function setErrors to modif
    const validErr = validate();
    setErrors(validErr);
    setServerError("");

    // check len of obj if 0 so it's true
    if (Object.keys(validErr).length > 0) return;

    const submitData = new FormData();
    submitData.append("firstname", formData.firstName.trim());
    submitData.append("lastname", formData.lastName.trim());
    submitData.append("email", formData.email.trim());
    submitData.append("password", formData.password);
    submitData.append("birthday", formData.birthday);
    if (formData.nickname)
      submitData.append("nickname", formData.nickname.trim());
    if (formData.bio) submitData.append("bio", formData.bio.trim());
    if (formData.avatar) submitData.append("avatar", formData.avatar);

    try {
      const res = await fetch("api/register", {
        method: "POST",
        body: submitData,
      });

      const contentType = res.headers.get("content-type");

      if (res.status === 409) {
        setErrors({ email: "Email already exists." });
        return;
      }

      if (!res.ok) {
        const errorText = await res.text();
        setServerError(errorText);
        return;
      }

      if (contentType && contentType.includes("application/json")) {
        const result = await res.json();

        if (result.success) {
          
          setServerError("");
          router.push('/home');
          alert("Registration successful!");
        } else {
          setServerError(result.message || "Registration failed.");
        }
      } else {
        setServerError("Unexpected server response.");
      }
      window.location.href = "/home";
    } catch (error) {
      setServerError("Failed to connect to server.");
      return NextResponse.json({ 
        success: false, 
        message: 'Server error' 
      }, { status: 500 })
    }
  };

  return (
    <div className={styles.authContainer}>
  <div className={styles.authForm}>
      <h2 className={styles.heading3}>Create Account</h2>
      <p className={styles.subtitle}>
        Already have an account? <Link href="/login">Sign in</Link>
      </p>
      <form onSubmit={handleSubmit} className={styles.registerForm}>
        <div className={`${styles.formGroup} ${styles.formGroupDouble}`}>
          <div className={styles.field}>
            <label className={styles.label}>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={styles.inputText}
            />
            {errors.firstName && (
              <p className={styles.error}>{errors.firstName}</p>
            )}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={styles.inputText}
            />
            {errors.lastName && (
              <p className={styles.error}>{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.inputEmail}
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={styles.inputPassword}
          />
          {errors.password && <p className={styles.error}>{errors.password}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Date of Birth</label>
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            className={styles.inputDate}
          />
          {errors.birthday && <p className={styles.error}>{errors.birthday}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Nickname (Optional)</label>
          <input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            className={styles.inputText}
          />
          {errors.nickname && <p className={styles.error}>{errors.nickname}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>About Me (Optional)</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            className={styles.textarea}
          />
          {errors.bio && <p className={styles.error}>{errors.bio}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Avatar (Optional)</label>
          <div className={styles.avatarContainer}>
            {formData.avatar && (
              <div className={styles.avatarPreview}>
                <img 
                  src={URL.createObjectURL(formData.avatar)} 
                  alt="Avatar preview"
                  className={styles.avatarImage}
                />
                <button
                  type="button"
                  onClick={() => {
                    setFormData({...formData, avatar: null});
                  }}
                  className={styles.removeAvatar}
                >
                  <FaTrash className={styles.removeIcon} />
                </button>
              </div>
            )}
            <input
              type="file"
              name="avatar"
              onChange={handleChange}
              className={styles.inputFile}
              accept="image/*"
            />
          </div>
          {errors.avatar && <p className={styles.error}>{errors.avatar}</p>}
        </div>

        {serverError && (
          <p className={`${styles.error} ${styles.serverError}`}>
            {serverError}
          </p>
        )}

        <button type="submit" className={styles.submitBtn}>
          Create Account
        </button>
      </form>
    </div>
    </div>
  );
}
