"use client";
import FriendSuggestions from "@/components/friends/friend-suggestions"
import GroupSuggestions from "@/components/groups/group-suggestions";
import CurrentGroups from "@/components/groups/current-groups";
import FriendsList from "@/components/friends/friends-list";
import UpcomingEvents from "@/components/events/upcoming-events";
import styles from "@/styles/sidebar.module.css";
import { usePathname } from "next/navigation";



// Sample data for demonstration
const sampleFriendSuggestions = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    mutualFriends: 5,
    avatar: "/uploads/profile.jpeg",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    mutualFriends: 2,
    avatar: "/uploads/profile.jpeg",
  },
  {
    id: 3,
    firstName: "Mike",
    lastName: "Johnson",
    mutualFriends: 0,
    avatar: "/uploads/profile.jpeg",
  },
];

const sampleGroupSuggestions = [
  {
    id: 1,
    title: "Photography Enthusiasts",
    memberCount: 1250,
    isPublic: true,
    image: "/uploads/profile.jpeg",
  },
  {
    id: 2,
    title: "Web Developers",
    memberCount: 3421,
    isPublic: true,
    image: "/uploads/profile.jpeg",
  },
  {
    id: 3,
    title: "Local Events",
    memberCount: 532,
    isPublic: false,
    image: "/uploads/profile.jpeg",
  },
];

const sampleCurrentGroups = [
  {
    id: 1,
    title: "Book Club",
    unreadCount: 3,
    image: "/uploads/profile.jpeg",
  },
  {
    id: 2,
    title: "Hiking Adventures",
    unreadCount: 0,
    image: "/uploads/profile.jpeg",
  },
];

const sampleFriends = [
  {
    id: 1,
    firstName: "Sarah",
    lastName: "Williams",
    isOnline: true,
    avatar: "/uploads/profile.jpeg",
  },
  {
    id: 2,
    firstName: "David",
    lastName: "Brown",
    isOnline: false,
    lastActive: "2 hours ago",
    avatar: "/uploads/profile.jpeg",
  },
  {
    id: 3,
    firstName: "Emily",
    lastName: "Davis",
    isOnline: true,
    avatar: "/uploads/profile.jpeg",
  },
];

const sampleEvents = [
  {
    id: 1,
    title: "Photography Workshop",
    date: "2023-04-15T14:00:00Z",
    location: "Central Park",
    attendees: 5,
  },
  {
    id: 2,
    title: "Weekend Hike",
    date: "2023-04-22T09:00:00Z",
    location: "Mountain Ridge Trail",
    attendees: 3,
  },
];

export default function Sidebar({ position }) {
  const path = usePathname();

  // const reg = /^\/profile\/\d+$/;
  // if (!path || !(reg.test(path) || path === '/home' || path === '/events' || path === '/groups' || path === '/friends' || path === '/notifications')) {
  //   return null;
  // }

  return (
    <div className={styles.sidebar}>
      {position === "left" && (
        <>
          <CurrentGroups groups={sampleCurrentGroups} />
          <GroupSuggestions suggestions={sampleGroupSuggestions} />
          <UpcomingEvents events={sampleEvents} />
        </>
      )}

      {position === "right" && (
        <>
          <FriendsList friends={sampleFriends} title="Online Friends" />
          <FriendSuggestions suggestions={sampleFriendSuggestions} />
        </>
      )}
    </div>
  );
}
