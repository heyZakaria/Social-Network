"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./CreateGroup.module.css";

export default function CreateGroupCard() {
  const [checkAuth, setCheckAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [FormErr, setFormErr] = useState({
    DescriptionErr: null,
    TitleErr: null,
    ImgErr: null,
  });
  const [Err, setErr] = useState(null);
  const [SuccessMsg, setSuccessMsg] = useState(null);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({ Description: "", Title: "", Image: null });
  const router = useRouter();

  const currentUser = 1;

  useEffect(() => {
    if (currentUser === 1) {
      setCheckAuth(true);
    } else {
      setCheckAuth(false);
      router.push("/login");
    }
    setLoading(false);
  }, [router]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      setFormErr((prev) => ({ ...prev, ImgErr: null }));
      setFile(null);
      return;
    }
    const imgExtension = ["png", "jpeg", "jpg"];
    const ext = selectedFile.name.split(".").pop().toLowerCase();

    if (
      selectedFile.name.startsWith(".") ||
      selectedFile.name.endsWith(".") ||
      !selectedFile.type.startsWith("image") ||
      !imgExtension.includes(ext)
    ) {
      setFormErr((prev) => ({
        ...prev,
        ImgErr: `${selectedFile.name} is not a valid image.`,
      }));
      return;
    }
    if (selectedFile.size > 1024 * 3000) {
      setFormErr((prev) => ({ ...prev, ImgErr: "Image size is too big." }));
      return;
    }

    setFormErr((prev) => ({ ...prev, ImgErr: null }));
    setFile(selectedFile);
    setFormData((prev) => ({ ...prev, Image: selectedFile }));
  };

  function HandleChange(e) {
    const { name, value } = e.target;

    if (name === "Title") {
      if (!value) {
        setFormErr((prev) => ({ ...prev, TitleErr: "Title is required" }));
      } else if (value.length < 10 || value.length > 100) {
        setFormErr((prev) => ({
          ...prev,
          TitleErr: "Title should be between 10 and 100 characters",
        }));
      } else {
        setFormErr((prev) => ({ ...prev, TitleErr: null }));
      }
    }

    if (name === "Description") {
      if (!value) {
        setFormErr((prev) => ({ ...prev, DescriptionErr: "Description is required" }));
      } else if (value.length < 30 || value.length > 250) {
        setFormErr((prev) => ({
          ...prev,
          DescriptionErr: "Description should be between 30 and 250 characters",
        }));
      } else {
        setFormErr((prev) => ({ ...prev, DescriptionErr: null }));
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (
      formData.Description === "" ||
      formData.Title === "" ||
      FormErr.TitleErr !== null ||
      FormErr.DescriptionErr !== null ||
      FormErr.ImgErr !== null
    ) {
      return;
    }
    try {
      const data = new FormData();
      data.append("Description", formData.Description);
      data.append("Title", formData.Title);
      if (formData.Image) data.append("Image", formData.Image);

      const Resp = await fetch("/api/groups/", {
        method: "POST",
        credentials: "include",
        body: data,
      });
      const Data = await Resp.json();

      console.log("Data of GRoups", Data);
      

      if (Resp.ok) {
        setSuccessMsg("Group created successfully");
        router.push(`/groups/${Data.data.id}`);
      } else {
        setErr(Data.msg || "Error occurred");
      }
    } catch (error) {
      setErr("Error sending request");
    }
  }

  if (loading) return null;
  if (!checkAuth) return null;

  return (
    <div className={styles.createGroupContainer}>
      <h3 className={styles.heading3}>Create Group</h3>

      <form onSubmit={handleSubmit} className={styles.createGroupForm}>
        <InputComp type="input" name="Title" label="Title" onChange={HandleChange} />
        {FormErr.TitleErr && <ErrorComp Err={FormErr.TitleErr} />}

        <InputComp type="input" name="Description" label="Description" onChange={HandleChange} />
        {FormErr.DescriptionErr && <ErrorComp Err={FormErr.DescriptionErr} />}

        <UploadInput
          name="cover"
          handleFileChange={handleFileChange}
          fileName={file ? file.name : ""}
        />
        {FormErr.ImgErr && <ErrorComp Err={FormErr.ImgErr} />}

        <button type="submit" className={styles.submitBtn} disabled={false}>
          Create Group
        </button>

        {SuccessMsg && <p className={styles.successMessage}>{SuccessMsg}</p>}
        {Err && <ErrorComp Err={Err} />}
      </form>
    </div>
  );
}

function InputComp({ onChange, name, label, type }) {
  return (
    <div className={styles.formGroup}>
      <label className={styles.label} htmlFor={name}>
        {label}
      </label>
      <input
        type={type}
        className={styles.inputText}
        name={name}
        placeholder={label}
        onChange={onChange}
        id={name}
        autoComplete="off"
      />
    </div>
  );
}

function ErrorComp({ Err }) {
  return <p className={styles.serverError}>{Err}</p>;
}

function UploadInput({ name, handleFileChange, fileName }) {
  return (
    <div className={styles.fileUploadWrapper}>
      <label htmlFor={name} className={styles.fileUploadLabel}>
        {fileName || "Upload A Cover"}
        <input
          id={name}
          type="file"
          name={name}
          onChange={handleFileChange}
          className={styles.fileInputHidden}
        />
      </label>
      {fileName && <span className={styles.fileNameDisplay}>{fileName}</span>}
    </div>
  );
}
