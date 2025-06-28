'use client';
import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { useUser } from "@/context/user_context";
import { useNotifications } from "@/context/notifications-context";

const FriendsContext = createContext();

export function FriendsProvider({ children }) {
  const { user: currentUser } = useUser();
  const { setNotifications } = useNotifications();
  const [suggestions, setSuggestions] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusCache, setStatusCache] = useState({});
  const [followStatuses, setFollowStatuses] = useState({});
  const [handledRequests, setHandledRequests] = useState({});
  const [hasFetched, setHasFetched] = useState(false);
  const [actionError, setActionError] = useState(null);
  
  // Cache refs for comparison
  const lastFetchTime = useRef(0);
  const isRefreshing = useRef(false);
  const pendingToggles = useRef(new Set());

  const updateFollowStatus = useCallback((userId, status) => {
    const id = String(userId);
    setFollowStatuses(prev => {
      const currentStatus = prev[id];
      // Only update if status actually changed
      if (!currentStatus || 
          currentStatus.isFollowing !== status.isFollowing || 
          currentStatus.requestPending !== status.requestPending) {
        return { ...prev, [id]: status };
      }
      return prev;
    });
    setStatusCache(prev => ({ ...prev, [id]: status }));
  }, []);

  const fetchAll = useCallback(async (force = false) => {
    // Prevent multiple concurrent fetches
    if (isRefreshing.current && !force) return;
    
    // Throttle requests - only fetch if 2+ seconds have passed
    const now = Date.now();
    if (!force && now - lastFetchTime.current < 2000) return;
    
    isRefreshing.current = true;
    setLoading(true);
    
    try {
      const res = await fetch("/api/users/friends", { credentials: "include" });
      const data = await res.json();

      const newSuggestions = data.data?.suggestions || [];
      const newRequests = data.data?.requests || [];

      setSuggestions(prev => {
        if (JSON.stringify(newSuggestions) !== JSON.stringify(prev)) {
          return newSuggestions;
        }
        return prev;
      });

      setRequests(prev => {
        if (JSON.stringify(newRequests) !== JSON.stringify(prev)) {
          return newRequests;
        }
        return prev;
      });

      lastFetchTime.current = now;
    } catch (e) {
      console.error("Error fetching friends data:", e);
      setSuggestions([]);
      setRequests([]);
    } finally {
      setLoading(false);
      isRefreshing.current = false;
    }
  }, []);

  // Initial fetch only
  useEffect(() => {
    if (!currentUser || hasFetched) return;
    
    fetchAll(true);
    setHasFetched(true);
  }, [currentUser, fetchAll, hasFetched]);

  // Clean up handled requests when requests change
  useEffect(() => {
    setHandledRequests(prev => {
      const updated = { ...prev };
      let hasChanges = false;
      
      for (const r of requests) {
        if (updated[r.id]) {
          delete updated[r.id];
          hasChanges = true;
        }
      }
      
      return hasChanges ? updated : prev;
    });
  }, [requests]);

  const getFollowStatus = useCallback(async (userId) => {
    const id = String(userId);

    // Return cached status if available and recent
    const cachedStatus = followStatuses[id];
    if (cachedStatus) {
      return cachedStatus;
    }

    try {
      const res = await fetch(`/api/users/follow?id=${id}`, { 
        method: "GET", 
        credentials: "include" 
      });
      const data = await res.json();
      
      const status = {
        isFollowing: data.data.Data?.IsFollowing || false,
        requestPending: data.data.Data?.RequestPending || false,
      };
      
      updateFollowStatus(id, status);
      return status;
    } catch {
      const defaultStatus = { isFollowing: false, requestPending: false };
      updateFollowStatus(id, defaultStatus);
      return defaultStatus;
    }
  }, [followStatuses, updateFollowStatus]);

  const startStatusPolling = useCallback((userId) => {
    // Just fetch the status once, no polling
    getFollowStatus(userId);
  }, [getFollowStatus]);

  const toggleFollow = useCallback(async (userId, showMessageButtonFunc) => {
    const id = String(userId);
    pendingToggles.current.add(id);
    
    try {
      const res = await fetch(`/api/users/follow?id=${id}`, { 
        method: "POST", 
        credentials: "include" 
      });
      const data = await res.json();
      
      const updatedStatus = {
        isFollowing: data.data.Data?.IsFollowing || false,
        requestPending: data.data.Data?.RequestPending || false,
      };
      
      updateFollowStatus(id, updatedStatus);
      
      // Refresh data after successful toggle
      setTimeout(() => fetchAll(), 500);
      
      if (showMessageButtonFunc) {
        showMessageButtonFunc(updatedStatus.isFollowing);
      }
      
      return updatedStatus;
    } catch (error) {
      console.error("Error toggling follow:", error);
      const errorStatus = { isFollowing: false, requestPending: false };
      updateFollowStatus(id, errorStatus);
      return errorStatus;
    } finally {
      pendingToggles.current.delete(id);
    }
  }, [updateFollowStatus, fetchAll]);

  const handleAcceptRequest = useCallback(async (userId) => {
    const id = String(userId);
    try {
      const res = await fetch(`/api/users/accept?id=${id}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();

      
      // Refresh data after successful action
      setTimeout(() => fetchAll(), 500);
      return data;
    } catch (err) {
      console.error("Error accepting friend request:", err);
      return null;
    }
  }, [fetchAll]);

  const handleRejectRequest = useCallback(async (userId) => {
    const id = String(userId);
    try {
      const res = await fetch(`/api/users/reject?id=${id}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();

      
      // Refresh data after successful action
      setTimeout(() => fetchAll(), 500);
      return data;
    } catch (err) {
      console.error("Error rejecting friend request:", err);
      return null;
    }
  }, [fetchAll]);

  const accept = useCallback(async (userId, notifId) => {
    setHandledRequests(prev => ({ ...prev, [notifId]: "accepted" }));
    await handleAcceptRequest(userId);
  }, [handleAcceptRequest]);

  const reject = useCallback(async (userId, notifId) => {
    setHandledRequests(prev => ({ ...prev, [notifId]: "rejected" }));
    await handleRejectRequest(userId);
  }, [handleRejectRequest]);

  const handleInviteResponse = useCallback(async (action, id) => {
    try {
      const response = await fetch(`/api/groups/group/inviteResponse?Action=${action}&Invite_id=${id}`, {
        credentials: 'include',
        method: "POST"
      });

      const res = await response.json();
      if (!response.ok || !res.success) {
        throw new Error(res.message || "Failed to process this action");
      }
      
      // Refresh data after successful action
      setTimeout(() => fetchAll(), 500);
      return res;
    } catch (error) {
      setActionError(error.message);
      throw error;
    }
  }, [fetchAll]);

  const handleInviteAdminResponse = useCallback(async (action, id) => {
    try {
      const response = await fetch(`/api/groups/invite/approve?Action=${action}&Invite=${id}`, {
        credentials: 'include',
        method: "POST"
      });

      const res = await response.json();
      if (!response.ok || !res.success) {
        throw new Error(res.message || "Failed to process this action");
      }
      
      // Refresh data after successful action
      setTimeout(() => fetchAll(), 500);
      return res;
    } catch (error) {
      setActionError(error.message);
      throw error;
    }
  }, [fetchAll]);

  const HandleEventPresence = useCallback(async (groupId, eventId, action) => {
    try {
      const response = await fetch(`/api/groups/event_presence/response`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          group_id: groupId,
          event_id: eventId,
          presence: action,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Event presence error");
      }

      const data = await response.json();
      
      // Refresh data after successful action
      setTimeout(() => fetchAll(), 500);
      return data;
    } catch (error) {
      console.error("Error handling event presence:", error);
      throw error;
    }
  }, [fetchAll]);

  // Manual refresh function for when needed
  const refreshData = useCallback(() => {
    fetchAll(true);
  }, [fetchAll]);

  return (
    <FriendsContext.Provider
      value={{
        suggestions,
        requests,
        loading,
        refetch: fetchAll,
        refreshData,
        getFollowStatus,
        toggleFollow,
        followStatuses,
        updateFollowStatus,
        handledRequests,
        setHandledRequests,
        accept,
        reject,
        startStatusPolling,
        handleInviteResponse,
        handleInviteAdminResponse,
        HandleEventPresence,
        actionError,
        setActionError,
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
}

export function useFriends() {
  return useContext(FriendsContext);
}