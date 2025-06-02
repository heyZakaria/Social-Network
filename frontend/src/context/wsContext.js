"use client"
import { createContext, useEffect, useState, useRef } from 'react';

export const wsContext = createContext()

export default function WsProvider({ children }) {
    // const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const ws = useRef(null);


    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8080/ws');

        ws.current.onopen = () => {

            console.log('Connected to WebSocket');
            setIsConnected(true)
        }
        ws.current.onmessage = msg => {
            let data = JSON.parse(msg.data)
            if (data.type == "message") {
                setMessages(prev => [...prev, data]);
            } else if (data.type == "notification") {

                console.log("Notification Received:", data.message);
                setNotifications(prev => [...prev, data.message]);
            }
        };

        ws.current.onclose = () => console.log('Disconnected');

        return () => {
            ws.current.close();
            setIsConnected(false)
        };
    }, []);


    const sendMessage = (msg) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {

            ws.current.send(JSON.stringify({ type: "message", message: msg }));
        }
    };

    return (<wsContext.Provider value={{ isConnected, messages, sendMessage }}>
        {children}
    </wsContext.Provider>
    )
}

