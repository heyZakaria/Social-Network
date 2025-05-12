"use client"

import { useState, useRef, useEffect } from "react"
import styles from "@/styles/emoji-picker.module.css"
import { MdOutlineMood } from 'react-icons/md';
// Common emoji categories with a selection of popular emojis
const emojiCategories = [
  {
    name: "Smileys",
    emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘"],
  },
  {
    name: "Gestures",
    emojis: ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "👋", "🤚", "🖐️", "✋", "🖖"],
  },
  {
    name: "Animals",
    emojis: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧"],
  },
  {
    name: "Food",
    emojis: ["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆"],
  },
  {
    name: "Activities",
    emojis: ["⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🎱", "🏓", "🏸", "🥅", "🏒", "🏑", "🥍", "🏏", "🎿"],
  },
  {
    name: "Travel",
    emojis: ["🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🚚", "🚛", "🚜", "🛴", "🚲", "🛵", "🏍️"],
  },
  {
    name: "Objects",
    emojis: ["💌", "📧", "📨", "📩", "📤", "📥", "📦", "📫", "📪", "📬", "📭", "📮", "🗳️", "✏️", "✒️", "🖋️", "🖊️"],
  },
  {
    name: "Symbols",
    emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘"],
  },
]

export default function EmojiPicker({ onEmojiSelect }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState(0)
  const pickerRef = useRef(null)

  // Close emoji picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleEmojiClick = (emoji) => {
    onEmojiSelect(emoji)
    setIsOpen(false)
  }

  return (
    <div className={styles.emojiPickerContainer} ref={pickerRef}>
      <button
        type="button"
        className={styles.emojiButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open emoji picker"
      >
        <MdOutlineMood size={20} />
      </button>

      {isOpen && (
        <div className={styles.emojiPicker}>
          <div className={styles.emojiCategories}>
            {emojiCategories.map((category, index) => (
              <button
                key={category.name}
                className={`${styles.categoryButton} ${activeCategory === index ? styles.active : ""}`}
                onClick={() => setActiveCategory(index)}
              >
                {category.emojis[0]}
              </button>
            ))}
          </div>
          <div className={styles.emojiList}>
            {emojiCategories[activeCategory].emojis.map((emoji, index) => (
              <button key={index} className={styles.emoji} onClick={() => handleEmojiClick(emoji)}>
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
