'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { OpenWebSocket } from '@/lib/websocket/websocket.js'; // Adjust the import path as needed
import FloatingChat from '@/components/chat/floating-chat';
const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/users/profile', {
        method: 'GET',
        credentials: 'include', 
      });

      if (res.ok) {
        const json = await res.json();
        setUser(json.data.Data);
        OpenWebSocket();
        console.log("//////////////////////////////////",json.data.Data);
        
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();

  }, []);

  return (
    <UserContext.Provider value={{ user, loading, setUser, fetchUser }}>
       {/* Always visible floating chat */}
      {/* {user &&
        // <FloatingChat currentUser={user} />
        
      } */}
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
