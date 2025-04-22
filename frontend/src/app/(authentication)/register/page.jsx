"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

const registerSchema = z.object({
  firstName: z.string().min(3, "Min 3 chars.").max(20, "Max 20 chars.").trim(),
  lastName: z.string().min(3, "Min 3 chars.").max(20, "Max 20 chars.").trim(),
  email: z.string().email("Invalid email.").trim(),
  password: z.string()
    .min(8, "Min 8 chars.")
    .regex(/[a-z]/, "Needs lowercase.")
    .regex(/[A-Z]/, "Needs uppercase.")
    .regex(/[0-9]/, "Needs number.")
    .trim(),
  birthday: z.coerce.date().refine((date) => {
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    const m = today.getMonth() - date.getMonth();
    const d = today.getDate() - date.getDate();
    return age > 15 || (age === 15 && (m > 0 || (m === 0 && d >= 0)));
  }, { message: "Must be 15+." }),
  nickName: z.string()
    .max(20, "Max 20 chars.")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscore allowed.")
    .trim()
    .optional(),
  bio: z.string().max(200, "Max 200 chars.").trim().optional(),
  avatar: z.any().optional(),
});

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const [avatarError, setAvatarError] = useState("");
  const [serverError, setServerError] = useState("");
  const [emailrError, setEmailrError] = useState("");

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("firstname", data.firstName);
    formData.append("lastname", data.lastName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("birthday", data.birthday.toISOString().split("T")[0]);

    if (data.nickName) formData.append("nickname", data.nickName);
    if (data.bio) formData.append("bio", data.bio);

    const avatarFile = data.avatar?.[0];
    if (avatarFile) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(avatarFile.type)) {
        setAvatarError("Only jpeg, png, or webp images allowed.");
        return;
      }
      if (avatarFile.size > 1 * 1024 * 1024) {
        setAvatarError("Avatar must be less than 1MB.");
        return;
      }
      setAvatarError("");
      formData.append("avatar", avatarFile);
    }

    try {
      const res = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        body: formData,
      });

      const contentType = res.headers.get("content-type");

      if (res.status === 409) {
        setEmailrError("Email already exists.");
        return;
      }

      if (!res.ok) {
        const errorText = await res.text();
        setServerError(errorText);
        return;
      }

      if (contentType?.includes("application/json")) {
        const result = await res.json();
        if (result.success === "true") {
          console.log("Registered", result);
          setServerError("");
        } else {
          setServerError("Registration failed.");
        }
      } else {
        setServerError("Unexpected server response.");
      }
    } catch {
      setServerError("Failed to connect to server.");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Create a new account</h2>

        <input {...register("firstName")} placeholder="First Name" />
        {errors.firstName && <p className="err-msg">{errors.firstName.message}</p>}

        <input {...register("lastName")} placeholder="Last Name" />
        {errors.lastName && <p className="err-msg">{errors.lastName.message}</p>}

        <input {...register("email")} placeholder="Email" type="email"
        onChange={(e) => {setEmailrError("");
          register("email").onChange(e);
          
          }} />
        {errors.email && <p className="err-msg">{errors.email.message}</p>}
        {emailrError && <p className="err-msg">{emailrError}</p>}

        <input {...register("password")} placeholder="Password" type="password" />
        {errors.password && <p className="err-msg">{errors.password.message}</p>}

        <input {...register("birthday")} type="date" />
        {errors.birthday && <p className="err-msg">{errors.birthday.message}</p>}

        <input {...register("nickName")} placeholder="Nickname (optional)" />
        {errors.nickName && <p className="err-msg">{errors.nickName.message}</p>}

        <input {...register("bio")} placeholder="Bio (optional)" />
        {errors.bio && <p className="err-msg">{errors.bio.message}</p>}

        <input type="file" {...register("avatar")} accept="image/*" />
        {avatarError && <p className="err-msg">{avatarError}</p>}

        <button type="submit">Register</button>
        <br />
        <Link href="/login">Already have an account?</Link>
        <br /><br />
        {serverError && <p className="err-msg">{serverError}</p>}
      </form>
    </>
  );
}
