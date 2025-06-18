'use client';
import { createContext, useContext, useState, useEffect } from "react";

const FriendsContext = createContext();

export function FriendsProvider({ children }) {
  const [suggestions, setSuggestions] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusCache, setStatusCache] = useState({});
  const [handledRequests, setHandledRequests] = useState({});

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/friends", { credentials: "include" });
      const data = await res.json();
      setSuggestions(data.data?.suggestions || []);
      setRequests(data.data?.requests || []);
    } catch (e) {
      setSuggestions([]);
      setRequests([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const getFollowStatus = async (userId) => {
    const id = String(userId);
    if (statusCache[id]) return statusCache[id];

    try {
      const res = await fetch(`/api/users/follow?id=${id}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      const status = {
        isFollowing: data.data.Data?.IsFollowing || false,
        requestPending: data.data.Data?.RequestPending || false,
      };
      setStatusCache((prev) => ({ ...prev, [id]: status }));
      return status;
    } catch (err) {
      return { isFollowing: false, requestPending: false };
    }
  };

const toggleFollow = async (userId) => {
  const id = String(userId);
  try {
    const res = await fetch(`/api/users/follow?id=${id}`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    const updatedStatus = {
      isFollowing: data.data.Data?.IsFollowing || false,
      requestPending: data.data.Data?.RequestPending || false,
    };
    setStatusCache((prev) => ({ ...prev, [id]: updatedStatus }));
    await fetchAll();

    return updatedStatus;
  } catch (err) {
    console.error("Follow error:", err);
    return { isFollowing: false, requestPending: false };
  }
};


  const handleAcceptRequest = async (userId) => {
    try {
      await fetch(`/api/users/accept?id=${userId}`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Accept error", err);
    }
  };

  const handleRejectRequest = async (userId) => {
    try {
      await fetch(`/api/users/reject?id=${userId}`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Reject error", err);
    }
  };

  const accept = async (id) => {
    await handleAcceptRequest(id);
    setHandledRequests((prev) => ({ ...prev, [id]: "accepted" }));
  };

  const reject = async (id) => {
    await handleRejectRequest(id);
    setHandledRequests((prev) => ({ ...prev, [id]: "rejected" }));
  };

  return (
    <FriendsContext.Provider
      value={{
        suggestions,
        requests,
        loading,
        refetch: fetchAll,
        getFollowStatus,
        toggleFollow,
        handledRequests,
        accept,
        reject,
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
}

export function useFriends() {
  return useContext(FriendsContext);
}
