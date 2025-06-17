import { HiUser, HiUsers, HiUserGroup, HiCalendar, HiBell, HiCheckCircle, HiChatBubbleOvalLeftEllipsis } from "react-icons/hi2";

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
