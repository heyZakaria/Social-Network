"use client"

import { useState } from "react"
import styles from "../../styles/groups.module.css"

export default function CreateGroupModal({ currentUser, onClose, onGroupCreated }) {
  const [groupData, setGroupData] = useState({
    name: "",
    description: "",
    image: null,
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setGroupData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setGroupData((prev) => ({ ...prev, image: file }))

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!groupData.name.trim()) {
      newErrors.name = "Group name is required"
    }

    if (!groupData.description.trim()) {
      newErrors.description = "Group description is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call
      // For now, we'll simulate creating a group
      const newGroup = {
        id: Date.now(),
        name: groupData.name,
        description: groupData.description,
        image: groupData.image ? "/placeholder.svg?height=300&width=300" : null,
        creatorId: currentUser.id,
        members: [currentUser.id],
        createdAt: new Date().toISOString(),
      }

      // Notify parent component
      if (onGroupCreated) {
        onGroupCreated(newGroup)
      }
    } catch (error) {
      console.error("Error creating group:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Create New Group</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalContent}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Group Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={groupData.name}
              onChange={handleChange}
              placeholder="Enter group name"
            />
            {errors.name && <div className={styles.error}>{errors.name}</div>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={groupData.description}
              onChange={handleChange}
              placeholder="What's this group about?"
              rows="4"
            />
            {errors.description && <div className={styles.error}>{errors.description}</div>}
          </div>

          <div className={styles.formGroup}>
            <label>Group Image</label>
            <div className={styles.imageUpload}>
              {imagePreview ? (
                <div className={styles.imagePreviewContainer}>
                  <img src={imagePreview || "/placeholder.svg"} alt="Group preview" className={styles.imagePreview} />
                  <button
                    type="button"
                    className={styles.removeImageButton}
                    onClick={() => {
                      setGroupData((prev) => ({ ...prev, image: null }))
                      setImagePreview(null)
                    }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className={styles.uploadButton}>
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  Upload Image
                </label>
              )}
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelButton} onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
