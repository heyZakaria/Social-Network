'use client';
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useUser } from "@/context/user_context";

const FriendsContext = createContext();

export function FriendsProvider({ children }) {
  const { user: currentUser } = useUser();

  const [suggestions, setSuggestions] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusCache, setStatusCache] = useState({});
  const [followStatuses, setFollowStatuses] = useState({});
  const [handledRequests, setHandledRequests] = useState({});
  const [hasFetched, setHasFetched] = useState(false);
  const suggestionsRef = useRef(suggestions);
  const requestsRef = useRef(requests);

  useEffect(() => {
    suggestionsRef.current = suggestions;
  }, [suggestions]);

  useEffect(() => {
    requestsRef.current = requests;
  }, [requests]);

  // Function to update global follow status
  const updateFollowStatus = (userId, status) => {
    const id = String(userId);
    console.log(`Updating follow status for user ${id}:`, status); // Debug log
    
    setFollowStatuses(prev => {
      const updated = { ...prev, [id]: status };
      console.log('Updated followStatuses:', updated); // Debug log
      return updated;
    });
    
    // Also update status cache to keep them in sync
    setStatusCache(prev => ({ ...prev, [id]: status }));
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/friends", { credentials: "include" });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();

      const newSuggestions = data.data?.suggestions || [];
      const newRequests = data.data?.requests || [];

      const suggestionsChanged = JSON.stringify(newSuggestions) !== JSON.stringify(suggestionsRef.current);
      const requestsChanged = JSON.stringify(newRequests) !== JSON.stringify(requestsRef.current);

      if (suggestionsChanged) setSuggestions(newSuggestions);
      if (requestsChanged) setRequests(newRequests);
    } catch (e) {
      console.error("fetchAll error:", e);
      setSuggestions([]);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser) return;

    if (!hasFetched) {
      fetchAll();
      setHasFetched(true);
    }

    fetchAll();

    const intervalId = setInterval(() => {
      fetchAll();

      suggestionsRef.current.forEach((user) => {
        getFollowStatus(user.id);
      });

      requestsRef.current.forEach((user) => {
        if (!handledRequests[user.id]) {
          getFollowStatus(user.id);
        }
      });
    }, 2000);

    return () => clearInterval(intervalId);
  }, [currentUser]);

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
      
      // Update global follow status - IMPORTANT: Use the string ID
      updateFollowStatus(id, status);
      
      await fetchAll();
      return status;
    } catch (err) {
      const defaultStatus = { isFollowing: false, requestPending: false };
      // Even on error, update the global status to prevent infinite loading
      updateFollowStatus(id, defaultStatus);
      return defaultStatus;
    }
  };

  const toggleFollow = async (userId) => {
    const id = String(userId);
    console.log(`Toggle follow for user ${id}`); // Debug log
    
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
      
      console.log(`Toggle follow result for user ${id}:`, updatedStatus); // Debug log
      
      setStatusCache((prev) => ({ ...prev, [id]: updatedStatus }));
      
      // Update global follow status immediately - IMPORTANT: Use the string ID
      updateFollowStatus(id, updatedStatus);
      
      await fetchAll();
      return updatedStatus;
    } catch (err) {
      console.error("Follow error:", err);
      const errorStatus = { isFollowing: false, requestPending: false };
      updateFollowStatus(id, errorStatus);
      return errorStatus;
    }
  };

  const handleAcceptRequest = async (userId) => {
    try {
      await fetch(`/api/users/accept?id=${userId}`, {
        method: "POST",
        credentials: "include",
      });
      
      // Update the follow status when accepting a request
      const id = String(userId);
      const acceptedStatus = { isFollowing: true, requestPending: false };
      updateFollowStatus(id, acceptedStatus);
      
      await fetchAll();
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
      
      // Update the follow status when rejecting a request
      const id = String(userId);
      const rejectedStatus = { isFollowing: false, requestPending: false };
      updateFollowStatus(id, rejectedStatus);
      
      await fetchAll();
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
        followStatuses,
        updateFollowStatus,
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