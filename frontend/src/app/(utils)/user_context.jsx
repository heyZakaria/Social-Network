'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      const res = await fetch('/api/users/profile', { method: 'GET' }, router);
      
      
      if (res?.ok) {
        const json = await res.json();
        setUser(json.data.Data);
        
        
      } else {
        setUser(null);
      }
      setLoading(false);
    }

    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
