'use client';
import { createContext, useContext, useState } from "react";

const FriendsContext = createContext();

export function FriendsProvider({ children }) {
  const [suggestions, setSuggestions] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusCache, setStatusCache] = useState({});

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/friends", { credentials: "include" });
      const data = await res.json();
      console.log("Friends response:::::::::::::::::::::::::", data);
      setSuggestions(data.data?.suggestions || []);
      setRequests(data.data?.requests || []);

      console.log("Friends data:", data);
    } catch (e) {
      setRequests([]);
      setSuggestions([]);
    }
    setLoading(false);
  }
  const getFollowStatus = async (userId) => {
    const id = String(userId);
    if (statusCache[id]) return statusCache[id];

    try {
      const res = await fetch(`/api/users/follow?id=${id}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      console.log("Follow status response:", data);
      
      const status = {
        isFollowing: data.data.Data?.IsFollowing || false,
        requestPending: data.data.Data?.RequestPending || false,
      };
      setStatusCache((prev) => ({ ...prev, [id]: status }));
      return status;
    } catch (err) {
      console.error("Error getting follow status:", err);
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
    const id = String(userId);
    try {
      const res = await fetch(`/api/users/accept?id=${id}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      console.log("Accept request response:", data);
      // await fetchAll();
      // return data.data.Data;
    } catch (err) {
      console.error("Error accepting friend request:", err);
      return null;
    }
  }
  const handleRejectRequest = async (userId) => {
    const id = String(userId);
    try {
      const res = await fetch(`/api/users/reject?id=${id}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      console.log("Reject request response:", data);
      // await fetchAll();
      // return data.data.Data;
    } catch (err) {
      console.error("Error rejecting friend request:", err);
      return null;
    }
  }

  return (
    <FriendsContext.Provider
      value={{
        suggestions,
        loading,
        requests,
        refetch: fetchAll,
        getFollowStatus,
        toggleFollow,
        handleAcceptRequest,
        handleRejectRequest,
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
}

export function useFriends() {
  return useContext(FriendsContext);
}
