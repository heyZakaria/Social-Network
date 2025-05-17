import { useEffect, useState, useRef } from 'react';
import styles from "@/styles/GroupChat.module.css";


let socket;

export default function GroupChat() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8080/ws');

        ws.current.onopen = () => console.log('Connected to WebSocket');
        
        ws.current.onmessage = event => {
            console.log("Received message:", event.data);
            setMessages(prev => [...prev, event.data]);
        };

        ws.current.onclose = () => console.log('Disconnected');

        return () => {
            ws.current.close();
        };
    }, []);

    const sendMessage = () => {
        if (input.trim()) {
            console.log("Sending message:", input);
            
            ws.current.send(input);
           // setMessages(prev => [...prev, input]);
            setInput('');
        }
    };

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
            <button className={styles.SendButton} onClick={sendMessage}>Send</button>
        </div>
    );
}
