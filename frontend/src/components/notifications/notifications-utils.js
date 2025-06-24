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
import { useFriends } from "@/context/friends_context";

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
  id,
  invitedId
) {
  const status = handledRequests[notifId];
  const { handleInviteResponse, handleInviteAdminResponse } = useFriends()

  const actionableTypes = ["follow_request", "invite_group", "group_event", "follow", "invite_group_admin"];
  if (!actionableTypes.includes(type)) return null;

  if (type === "follow") {
    return <FollowButton targetUserId={id} />;
  }

  if (status === "accepted") {
    let label = "Accepted";
    if (type === "group_event") label = "Going";
    else if (type === "invite_group") label = "Joined";
    return <div className={`${styles.status} ${styles.accepted}`}>{label}</div>;
  }

  if (status === "rejected") {
    let label = "Rejected";
    if (type === "group_event") label = "Not Going";
    else if (type === "invite_group") label = "Ignored";
    return <div className={`${styles.status} ${styles.rejected}`}>{label}</div>;
  }

  const isEvent = type === "group_event";
  const isGroupInvite = type === "invite_group";
  const isAdminReq = type === "invite_group_admin"

  const handleJoinGroup = (e) => {
    e.preventDefault();
    console.log("inveteeeeeeeeed", invitedId);

    handleInviteResponse("accept", invitedId)
    handledRequests[notifId] = "accepted";
  };

  const handleIgnoreGroup = (e) => {
    e.preventDefault();
    console.log("inveteeeeeeeeed", invitedId);

    handleInviteResponse("reject", invitedId)
    handledRequests[notifId] = "rejected";
  };

  const handleGoingToEvent = (e) => {
    e.preventDefault();
    // accept(id);
    handledRequests[notifId] = "accepted";
  };

  const handleNotGoingToEvent = (e) => {
    e.preventDefault();
    // reject(id);
    handledRequests[notifId] = "rejected";
  };

  return (
    <div className={styles.actionContainer}>
      {/* Accept buttons by type */}
      {(type === "follow_request" || isAdminReq) && (
        <button
          className={`${styles.actionButton} ${styles.acceptButton}`}
          onClick={(e) => {
            e.preventDefault();
            if (type === "follow_request") {
              accept(id);
            } else {
              handleInviteAdminResponse("accept", invitedId);
            }
            handledRequests[notifId] = "accepted";
          }}
        >
          <FaUserPlus size={16} /> Accept
        </button>
      )}


      {isGroupInvite && (
        <button
          className={`${styles.actionButton} ${styles.acceptButton}`}
          onClick={handleJoinGroup}
        >
          <FaCheck size={16} /> Join
        </button>
      )}

      {isEvent && (
        <button
          className={`${styles.actionButton} ${styles.acceptButton}`}
          onClick={handleGoingToEvent}
        >
          <FaCheckCircle size={16} /> Going
        </button>
      )}

      {/* Reject buttons by type */}
      {(type === "follow_request" || isAdminReq) && (
        <button
          className={`${styles.actionButton} ${styles.rejectButton}`}
          onClick={(e) => {
            e.preventDefault();
            if (type === "follow_request") {
              reject(id);
            } else {
              handleInviteAdminResponse("reject", invitedId);
            }
            handledRequests[notifId] = "rejected";
          }}
        >
          <FaUserSlash size={16} /> Reject
        </button>
      )}

      {isGroupInvite && (
        <button
          className={`${styles.actionButton} ${styles.rejectButton}`}
          onClick={handleIgnoreGroup}
        >
          <FaTimes size={16} /> Ignore
        </button>
      )}

      {isEvent && (
        <button
          className={`${styles.actionButton} ${styles.rejectButton}`}
          onClick={handleNotGoingToEvent}
        >
          <FaTimesCircle size={16} /> Not Going
        </button>
      )}
    </div>
  );
}
