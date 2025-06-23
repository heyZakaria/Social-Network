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
    case "follow_request_accepted":
      return <HiCheckCircle size={18} className={className} />;
    case "group_event":
      return <HiCalendar size={18} className={className} />;
    default:
      return <HiBell size={18} className={className} />;
  }
}


export function getActionButtons(type, id, handledRequests, accept, reject, invitedId) {
  const { handleInviteResponse: handledMap } = useFriends();
  const status = handledMap[id];


  // console.log("+++++++++++++++++++++++++++++++++++++", invitedId);
  
  // Special: follow_request_accepted → just FollowButton
  if (type === "follow_request_accepted") {
    return <FollowButton targetUserId={id} />;
  }

  // Show status if already handled
  if (status === "accepted") {
    return <div className={`${styles.status} ${styles.accepted}`}>Accepted</div>;
  }
  if (status === "rejected") {
    return <div className={`${styles.status} ${styles.rejected}`}>Rejected</div>;
  }

  const isFollowRequest = type === "follow_request";
  const isGroupEvent = type === "group_event";
  const isGroupInvite = type === "invite_group";

  return (
    <div className={styles.actionContainer}>
      {/* Accept */}
      {isFollowRequest  ? (
        <button
          className={`${styles.actionButton} ${styles.acceptButton}`}
          onClick={(e) => {
            e.preventDefault();
            accept(id);
          }}
        >
          <FaCheck size={16} /> Accept
        </button>
      ) : null}

      {/* Reject */}
      {isFollowRequest ? (
        <button
          className={`${styles.actionButton} ${styles.rejectButton}`}
          onClick={(e) => {
            e.preventDefault();
            reject(id);
          }}
        >
          <FaTimes size={16} /> Reject
        </button>
      ) : null}

      {/* Reply (all types below shown explicitly) */}
      {isGroupEvent && (
        <>
          <button
            className={`${styles.actionButton} ${styles.replyButton}`}
            onClick={(e) => {
              e.preventDefault();
              console.log(`Reply to event ${id}`);
            }}
          >
            <FaReply size={16} /> Going
          </button>

          <button
            className={`${styles.actionButton} ${styles.replyButton}`}
            onClick={(e) => {
              e.preventDefault();

              console.log(`Reply to group event ${id}`);
            }}
          >
            <FaReply size={16} /> Not Going
          </button>
        </>
      )}

      {isGroupInvite && (
        <>
          <button
          value={"Accept"}
            className={`${styles.actionButton} ${styles.replyButton}`}
            onClick={(e) => {
              e.preventDefault();
              handledMap(e, invitedId);
              console.log(`Reply to group invite ${invitedId}`);
            }}
          >
            <FaReply size={16} /> Accept
          </button>

          <button
          value={"Reject"}
            className={`${styles.actionButton} ${styles.replyButton}`}
            onClick={(e) => {
              e.preventDefault();
              handledMap(e, invitedId);
              console.log(`Reply to invite group ${invitedId}`);
            }}
          >
            <FaReply size={16} /> Reject
          </button>
        </>
      )}
    </div>
  );
}
