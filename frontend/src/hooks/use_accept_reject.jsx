import { useState } from "react";

export function useAcceptReject(handleAcceptRequest, handleRejectRequest, refetch) {
  const [handledRequests, setHandledRequests] = useState({});

  const accept = async (id) => {
    setHandledRequests(prev => ({ ...prev, [id]: "accepted" }));
    await handleAcceptRequest(id);
    refetch();
  };

  const reject = async (id) => {
    setHandledRequests(prev => ({ ...prev, [id]: "rejected" }));
    await handleRejectRequest(id);
    refetch();
  };

  return { handledRequests, accept, reject };
}
