"use client";

import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [profileInfo, setProfileInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    nickName: "",
    bio: "",
    avatar: "",
  });

  const [uploadAvatar, setAvatar] = useState(null);

  const handleAvatarUpload = (e) => {
    console.log(e.target.files[0]);
    console.log(e.target);

    setAvatar(e.target.files[0]);
  };

  const getProfileInfo = async (e) => {
    const { name, value } = e.target;
    setProfileInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const uploadImage = async () => {
    const data = new FormData();
    data.append("anyName", uploadAvatar);

    const send = await fetch("http://localhost:8080/upload", {
      method: "POST",
      body: data,
    });

    if (send.ok) {
      console.log("avatar sended");
    } else {
      console.log("avatar not sended");
    }
  };

  const fetchProfileInfo = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        body: JSON.stringify(profileInfo),
        headers: {
          "Content-type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <>
      <form
        method="POST"
        onSubmit={(e) => (
          e.preventDefault(),
          uploadImage(),
          getProfileInfo(e),
          fetchProfileInfo()
        )}
      >
        <h2>Create a new account:</h2>
        <br />
        <label>First Name:</label>
        <br />
        <input
          name="firstName"
          value={profileInfo.firstName}
          onChange={getProfileInfo}
          placeholder="First Name"
          type="text"
          className="first_name"
          minLength="3"
          required
        />
        <br />
        <label>Last Name:</label>
        <br />
        <input
          name="lastName"
          value={profileInfo.lastName}
          onChange={getProfileInfo}
          placeholder="Last Name"
          type="text"
          className="last_name"
          minLength="3"
          required
        />
        <br />
        <label>Email:</label>
        <br />
        <input
          name="email"
          value={profileInfo.email}
          onChange={getProfileInfo}
          placeholder="example@cnss.ma"
          type="email"
          className="email"
          minLength="8"
          required
        />
        <br />
        <label>Password:</label>
        <br />
        <input
          name="password"
          value={profileInfo.password}
          onChange={getProfileInfo}
          placeholder="example@cnss.ma"
          type="password"
          className="password"
          minLength="3"
          required
        />
        <h4>This Section is Optional</h4>
        <br />
        <label>Nickname:</label>
        <br />
        <input
          name="nickName"
          value={profileInfo.nickName}
          onChange={getProfileInfo}
          placeholder="La7ya"
          type="text"
          className="nickname"
        />
        <br />
        <label>Bio:</label>
        <br />
        <input
          name="bio"
          value={profileInfo.bio}
          onChange={getProfileInfo}
          type="text"
          className="img"
          placeholder="Hey my name is and you know me..."
        />
        <br />
        <label>Avatar:</label>
        <br />
        <input
          name="img"
          type="file"
          className="img"
          accept="image/jpeg, image/png, image/jpg"
          onChange={handleAvatarUpload}
        />
        <br />
        <br />
        <br /> <button type="submit">Register</button>
        <br />
        {/* Errooooooooor */}
        <br />
        <br />
        <Link href="/login">Already have an account?</Link>
      </form>
      <div id="display_image"></div>
    </>
  );
}

