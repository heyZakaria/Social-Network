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
  FaReply
} from "react-icons/fa";
import FollowButton from "@/components/profile/follow-button";

export function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minute(s) ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hour(s) ago`;
  return `${Math.floor(diffInSeconds / 86400)} day(s) ago`;
}



export function getNotificationIcon(type, className = "") {
  switch (type) {
    case "follow_request":
      return <HiUser size={18} className={className} />;
    case "invite":
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


export function getActionButtons(type, id, handledRequests, accept, reject) {
  const status = handledRequests[id];

  const actionableTypes = ["follow_request", "invite", "group_event", "follow"];
  if (!actionableTypes.includes(type)) return null;

  if (type === "follow") {
    return (
      <FollowButton targetUserId={id} />
    );
  }

  if (status === "accepted") {
    return <div className={`${styles.status} ${styles.accepted}`}>Accepted</div>;
  }
  if (status === "rejected") {
    return <div className={`${styles.status} ${styles.rejected}`}>Rejected</div>;
  }

  const isEvent = type === "group_event";
  const isGroupInvite = type === "invite";

  return (
    <div className={styles.actionContainer}>
      <button
        className={`${styles.actionButton} ${styles.acceptButton}`}
        onClick={(e) => {
          e.preventDefault();
          accept(id);
        }}
      >
        {isEvent ? (
          <>
            <FaCheckCircle size={16} /> Going
          </>
        ) : isGroupInvite ? (
          <>
            <FaUserPlus size={16} /> Join
          </>
        ) : (
          <>
            <FaCheck size={16} /> Accept
          </>
        )}
      </button>

      <button
        className={`${styles.actionButton} ${styles.rejectButton}`}
        onClick={(e) => {
          e.preventDefault();
          reject(id);
        }}
      >
        {isEvent ? (
          <>
            <FaTimesCircle size={16} /> Not Going
          </>
        ) : isGroupInvite ? (
          <>
            <FaUserSlash size={16} /> Ignore
          </>
        ) : (
          <>
            <FaTimes size={16} /> Reject
          </>
        )}
      </button>
    </div>
  );
}
