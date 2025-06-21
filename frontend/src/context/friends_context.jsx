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
  const statusIntervals = useRef({});
  const pendingToggles = useRef(new Set());

  useEffect(() => { suggestionsRef.current = suggestions; }, [suggestions]);
  useEffect(() => { requestsRef.current = requests; }, [requests]);

  const updateFollowStatus = (userId, status) => {
    const id = String(userId);
    setFollowStatuses(prev => ({ ...prev, [id]: status }));
    setStatusCache(prev => ({ ...prev, [id]: status }));
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/friends", { credentials: "include" });
      const data = await res.json();

      const newSuggestions = data.data?.suggestions || [];
      const newRequests = data.data?.requests || [];

      if (JSON.stringify(newSuggestions) !== JSON.stringify(suggestionsRef.current)) setSuggestions(newSuggestions);
      if (JSON.stringify(newRequests) !== JSON.stringify(requestsRef.current)) setRequests(newRequests);
    } catch (e) {
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

    const intervalId = setInterval(() => {
      fetchAll();
      suggestionsRef.current.forEach(user => startStatusPolling(user.id));
      requestsRef.current.forEach(user => startStatusPolling(user.id));
    }, 5000);

    return () => {
      clearInterval(intervalId);
      Object.values(statusIntervals.current).forEach(clearInterval);
    };
  }, [currentUser]);

  const startStatusPolling = (userId) => {
    const id = String(userId);
    if (statusIntervals.current[id]) return;

    const fetchAndUpdate = async () => {
      if (!pendingToggles.current.has(id)) {
        await getFollowStatus(id);
      }
    };

    fetchAndUpdate();
    statusIntervals.current[id] = setInterval(fetchAndUpdate, 1000);
  };

  const getFollowStatus = async (userId) => {
    const id = String(userId);

    try {
      const res = await fetch(`/api/users/follow?id=${id}`, { method: "GET", credentials: "include" });
      const data = await res.json();
      const status = {
        isFollowing: data.data.Data?.IsFollowing || false,
        requestPending: data.data.Data?.RequestPending || false,
      };
      updateFollowStatus(id, status);
      fetchAll();
      return status;
    } catch {
      const defaultStatus = { isFollowing: false, requestPending: false };
      updateFollowStatus(id, defaultStatus);
      return defaultStatus;
    }
  };

  const toggleFollow = async (userId) => {
    const id = String(userId);
    pendingToggles.current.add(id);
    try {
      const res = await fetch(`/api/users/follow?id=${id}`, { method: "POST", credentials: "include" });
      const data = await res.json();
      const updatedStatus = {
        isFollowing: data.data.Data?.IsFollowing || false,
        requestPending: data.data.Data?.RequestPending || false,
      };
      updateFollowStatus(id, updatedStatus);
      fetchAll();
      return updatedStatus;
    } catch {
      const errorStatus = { isFollowing: false, requestPending: false };
      updateFollowStatus(id, errorStatus);
      return errorStatus;
    } finally {
      pendingToggles.current.delete(id);
    }
  };

  const handleRequest = async (userId, action) => {
    const endpoint = `/api/users/${action}?id=${userId}`;
    try {
      await fetch(endpoint, { method: "POST", credentials: "include" });
      const status = action === "accept" ? { isFollowing: true, requestPending: false } : { isFollowing: false, requestPending: false };
      updateFollowStatus(String(userId), status);
      await fetchAll();
    } catch (err) {
      console.error(`${action} error`, err);
    }
  };

  const accept = async (id) => {
    await handleRequest(id, "accept");
    setHandledRequests(prev => ({ ...prev, [id]: "accepted" }));
  };

  const reject = async (id) => {
    await handleRequest(id, "reject");
    setHandledRequests(prev => ({ ...prev, [id]: "rejected" }));
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
        startStatusPolling,
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
}

export function useFriends() {
  return useContext(FriendsContext);
}
