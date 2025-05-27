// app/(utils)/friends-context.jsx
'use client';
import { createContext, useContext, useState, useEffect } from "react";

const FriendsContext = createContext();

export function FriendsProvider({ children }) {
  const [friends, setFriends] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusCache, setStatusCache] = useState({}); // userId -> { isFollowing, requestPending }

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/friends", { credentials: "include" });
      const data = await res.json();
      setFriends(data.data?.friends || []);
      setFollowers(data.data?.followers || []);
      setFollowing(data.data?.following || []);
      const sugRes = await fetch("/api/users/suggestions", { credentials: "include" });
      const sugData = await sugRes.json();
      setSuggestions(sugData.data?.users || []);
    } catch (e) {
      setFriends([]);
      setFollowers([]);
      setFollowing([]);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <FriendsContext.Provider
      value={{
        friends,
        followers,
        following,
        suggestions,
        loading,
        refetch: fetchAll,
        getFollowStatus,
        toggleFollow,
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
}

export function useFriends() {
  return useContext(FriendsContext);
}
