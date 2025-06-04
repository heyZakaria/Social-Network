"use client"

import { useEffect, useRef } from "react"
import styles from "@/styles/modal.module.css"
import { IoPaperPlaneOutline } from 'react-icons/io5';

export default function Modal({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null)

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.addEventListener("mousedown", handleClickOutside)
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.removeEventListener("mousedown", handleClickOutside)
      // Restore scrolling when modal is closed
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal} ref={modalRef}>
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
          <button className={styles.closeButton} onClick={onClose}>
          <IoPaperPlaneOutline size={16} />
          </button>
        </div>
        <div className={styles.modalContent}>{children}</div>
      </div>
    </div>
  )
}
