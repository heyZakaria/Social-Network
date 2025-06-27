import {
  HiUser,
  HiUsers,
  HiUserGroup,
  HiCalendar,
  HiBell,
  HiCheckCircle,
  HiChatBubbleOvalLeftEllipsis,
} from "react-icons/hi2";
import styles from "@/styles/notifications.module.css";
import {
  FaCheck,
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
  FaUserPlus,
  FaUserSlash,
} from "react-icons/fa";
import FollowButton from "@/components/profile/follow-button";

export function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} m ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} h ago`;
  return `${Math.floor(diffInSeconds / 86400)} d ago`;
}



export function getNotificationIcon(type, className = "") {
  switch (type) {
    case "follow_request":
      return <HiUser size={18} className={className} />;
    case "invite_group":
      return <HiUserGroup size={18} className={className} />;
    case "group":
      return <HiUsers size={18} className={className} />;
    case "accept":
      return <HiCheckCircle size={18} className={className} />;
    case "message":
      return <HiChatBubbleOvalLeftEllipsis size={18} className={className} />;
    case "group_event":
      return <HiCalendar size={18} className={className} />;
    default:
      return <HiBell size={18} className={className} />;
  }
}
export function getActionButtons(
  type,
  notifId,
  handledRequests,
  accept,
  reject,
  userId,
  invitedId,
  groupId,
  eventId,
    {
    setHandledRequests,
    handleInviteResponse,
    handleInviteAdminResponse,
    HandleEventPresence,
  }
) {
  const status = handledRequests[notifId];


  if (!["follow_request", "invite_group", "group_event", "follow", "invite_group_admin"].includes(type))
    return null;

  if (type === "follow") {
    return <FollowButton targetUserId={userId} />;
  }

  if (status === "accepted") {
    let label = "Accepted";
    if (type === "group_event") label = "Going";
    else if (type === "invite_group") label = "Joined";
    else if (type === "invite_group_admin") label = "Approved";
    return <div className={`${styles.status} ${styles.accepted}`}><FaCheckCircle /> {label}</div>;
  }

  if (status === "rejected") {
    let label = "Rejected";
    if (type === "group_event") label = "Not Going";
    else if (type === "invite_group") label = "Ignored";
    else if (type === "invite_group_admin") label = "Refused";
    return <div className={`${styles.status} ${styles.rejected}`}><FaTimesCircle /> {label}</div>;
  }

  const isGroupInvite = type === "invite_group";
  const isEvent = type === "group_event";

  return (
    <div className={styles.actionContainer}>
      {/* Follow Request */}
      {type === "follow_request" && (
        <>
          <button
            className={`${styles.actionButton} ${styles.acceptButton}`}
            onClick={(e) => {
              e.preventDefault();
              accept(userId, notifId);
            }}
          >
            <FaUserPlus size={14} /> Accept
          </button>

          <button
            className={`${styles.actionButton} ${styles.rejectButton}`}
            onClick={(e) => {
              e.preventDefault();
              reject(userId, notifId);
            }}
          >
            <FaUserSlash size={14} /> Reject
          </button>
        </>
      )}

      {/* Group Invite */}
      {isGroupInvite && (
        <>
          <button
            className={`${styles.actionButton} ${styles.acceptButton}`}
            onClick={(e) => {
              e.preventDefault();
              handleInviteResponse("accept", invitedId);
              setHandledRequests(prev => ({ ...prev, [notifId]: "accepted" }));
            }}
          >
            <FaCheck size={14} /> Join
          </button>

          <button
            className={`${styles.actionButton} ${styles.rejectButton}`}
            onClick={(e) => {
              e.preventDefault();
              handleInviteResponse("reject", invitedId);
              setHandledRequests(prev => ({ ...prev, [notifId]: "rejected" }));
            }}
          >
            <FaTimes size={14} /> Ignore
          </button>
        </>
      )}

      {/* Group Admin Invite */}
      {type === "invite_group_admin" && (
        <>
          <button
            className={`${styles.actionButton} ${styles.acceptButton}`}
            onClick={(e) => {
              e.preventDefault();
              handleInviteAdminResponse("accept", invitedId);
              setHandledRequests(prev => ({ ...prev, [notifId]: "accepted" }));
            }}
          >
            <FaCheckCircle size={14} /> Approve
          </button>

          <button
            className={`${styles.actionButton} ${styles.rejectButton}`}
            onClick={(e) => {
              e.preventDefault();
              handleInviteAdminResponse("reject", invitedId);
              setHandledRequests(prev => ({ ...prev, [notifId]: "rejected" }));
            }}
          >
            <FaTimesCircle size={14} /> Refuse
          </button>
        </>
      )}

      {/* Group Event */}
      {isEvent && (
        <>
          <button
            className={`${styles.actionButton} ${styles.acceptButton}`}
            onClick={(e) => {
              e.preventDefault();
              HandleEventPresence(groupId, eventId, "going")
              setHandledRequests(prev => ({ ...prev, [notifId]: "accepted" }));
            }}
          >
            <FaCheckCircle size={14} /> Going
          </button>

          <button
            className={`${styles.actionButton} ${styles.rejectButton}`}
            onClick={(e) => {
              e.preventDefault();
              HandleEventPresence(groupId, eventId, "not going")
              setHandledRequests(prev => ({ ...prev, [notifId]: "rejected" }));
            }}
          >
            <FaTimesCircle size={14} /> Not Going
          </button>
        </>
      )}
    </div>
  );
}
