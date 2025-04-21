"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

export const registerSchema = z.object({
  firstName: z.string().min(3, "First name must be at least 3 characters").max(20).trim(),
  lastName: z.string().min(3).max(20).trim(),
  email: z.string().email({ message: 'Enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[a-z]/, { message: "Must include lowercase letter." })
    .regex(/[A-Z]/, { message: "Must include uppercase letter." })
    .regex(/[0-9]/, { message: "Must include a number." })
    .trim(),
  birthday: z.coerce.date().refine((date) => {
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    const m = today.getMonth() - date.getMonth();
    const d = today.getDate() - date.getDate();
    return age > 15 || (age === 15 && (m > 0 || (m === 0 && d >= 0)));
  }, {
    message: "You must be at least 15 years old.",
  }),
  nickName: z.string().optional(),
  bio: z.string().optional(),
  // avatar: z.string().optional(),
});

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const [avatarError, setAvatarError] = useState("");
  
  const watchedAvatar = watch("avatar");

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const send = await fetch("http://localhost:8080/upload", {
      method: "POST",
      body: formData,
    });

    if (send.ok) {
      const response = await send.json();
      return response.filename || "";
    }

    console.log("Upload failed");
    return "";
  };

  const onSubmit = async (data) => {
    try {
      const file = data.avatar?.[0];

      if (file && file.size > 1 * 1024 * 1024) {
        setAvatarError("Avatar must be less than 1MB.");
        return;
      }
      setAvatarError("");

      const avatar = file ? await uploadImage(file) : "";

      const payload = {
        ...data,
        avatar,
      };

      const res = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const result = await res.json();
        console.log("Registered", result);
      }
    } catch (err) {
      console.error("Error:", err);
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

        <input {...register("email")} placeholder="Email" type="email" />
        {errors.email && <p className="err-msg">{errors.email.message}</p>}

        <input {...register("password")} placeholder="Password" type="password" />
        {errors.password && <p className="err-msg">{errors.password.message}</p>}

        <input {...register("birthday")} type="date" />
        {errors.birthday && <p className="err-msg">{errors.birthday.message}</p>}

        <input {...register("nickName")} placeholder="Nickname (optional)" />
        <input {...register("bio")} placeholder="Bio (optional)" />

        <input type="file" {...register("avatar")} accept="image/*" />
        {avatarError && <p className="err-msg">{avatarError}</p>}

        <button type="submit">Register</button>
        <br />
        <Link href="/login">Already have an account?</Link>
      </form>
    </>
  );
}
