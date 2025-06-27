'use client';
import { createContext, useContext, useState, useEffect, useRef } from "react";
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
  const suggestionsRef = useRef(suggestions);
  const requestsRef = useRef(requests);
  const statusIntervals = useRef({});
  const pendingToggles = useRef(new Set());
  const [actionError, setActionError] = useState(null)


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
    }, 1000);

    return () => {
      clearInterval(intervalId);
      Object.values(statusIntervals.current).forEach(clearInterval);
    };
  }, [currentUser]);

  useEffect(() => {
    setHandledRequests(prev => {
      const updated = { ...prev };
      for (const r of requests) {
        if (updated[r.id]) {
          delete updated[r.id];
        }
      }
      return updated;
    });
  }, [requests]);

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

  const toggleFollow = async (userId, showMessageButtonFunc) => {
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
      if (updatedStatus.isFollowing) {
        showMessageButtonFunc(true);
      } else {
        showMessageButtonFunc(false);
      }
      return updatedStatus;
    } catch {
      const errorStatus = { isFollowing: false, requestPending: false };
      updateFollowStatus(id, errorStatus);
      return errorStatus;
    } finally {
      pendingToggles.current.delete(id);
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


  const accept = async (userId, notifId) => {
    setHandledRequests(prev => ({ ...prev, [notifId]: "accepted" }));
    await handleAcceptRequest(userId);
    // fetchAll();
  };

  const reject = async (userId, notifId) => {
    setHandledRequests(prev => ({ ...prev, [notifId]: "rejected" }));
    await handleRejectRequest(userId);
    // fetchAll();
  };


  const handleInviteResponse = async (action, id) => {

    try {
      const respo = await fetch(`/api/groups/group/inviteResponse?Action=${action}&Invite_id=${id}`, {
        credentials: 'include',
        method: "POST"
      })

      const res = await respo.json()
      if (!respo.ok || !res.success) throw new Error(res.message || "Failed to process this action")
      onInvite(invite.invite_id)


    } catch (error) {
      setActionError(error.message)
    }
  }

  const handleInviteAdminResponse = async (action, id) => {
    try {
      const respo = await fetch(`/api/groups/invite/approve?Action=${action}&Invite=${id}`, {
        credentials: 'include',
        method: "POST"
      })

      const res = await respo.json()
      if (!respo.ok || !res.success) throw new Error(res.message || "Failed to process this action")
      onInvite(invite.invite_id)
    } catch (error) {
      setActionError(error.message)
    }
  }

  const HandleEventPresence = async (groupId, eventId, action) => {
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

    } catch {
      console.error("Error handling event presence");
    }
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
        setHandledRequests,
        accept,
        reject,
        startStatusPolling,
        handleInviteResponse,
        handleInviteAdminResponse,
        HandleEventPresence,
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
}

export function useFriends() {
  return useContext(FriendsContext);
}
