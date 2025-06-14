"use client"

import { useState, useContext } from 'react';
import styles from "@/styles/groupChat.module.css";
import { wsContext } from '@/context/wsContext';

let socket;

export default function GroupChat() {
    const [input, setInput] = useState('');
    const { messages, sendMessage } = useContext(wsContext);

    const sendIT = () => {
        if (input.trim()) {
            sendMessage(input)
            setInput('')
        }
    }

    return (
        <div className={styles.GroupChat}>
            <h2>Group Chat</h2>
            <div className={styles.ShowMessages}>
                {messages.map((msg, idx) => (
                    <div key={idx}>{msg || "---"}</div>
                ))}
            </div>
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type a message"
                className={styles.GroupChatInput}
            />
            <button className={styles.SendButton} onClick={sendIT}>Send</button>
        </div>
    );
}
