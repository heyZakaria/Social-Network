// import { getCurrentUser } from "@/actions/auth";
import Link from "next/link";
import styles from "@/styles/events.module.css";
import { IoAddOutline } from "react-icons/io5";
import FloatingChat from "@/components/chat/floating-chat";
import ShowEventForm from "@/components/events/eventCard";
import Image from "next/image";

// Sample events data
const sampleEvents = [
  {
    id: 1,
    title: "Photography Workshop",
    description: "Learn advanced composition techniques and editing skills.",
    date: "2023-04-15T14:00:00Z",
    location: "Central Park",
    organizer: {
      id: 2,
      name: "Jane Smith",
      avatar: "/uploads/profile.jpeg",
    },
    attendees: {
      going: [1, 3],
      notGoing: [2],
    },
    image:
      "https://imgs.search.brave.com/jLfYC2vnVrdKM1pTa5AmFzHt4c7QNiv3c6zQe-UtXoA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcm9t/by5jb20vdG9vbHMv/aW1hZ2UtcmVzaXpl/ci9zdGF0aWMvUGF0/dGVybl9pbWFnZS04/YzA1MDA1M2VhYjg4/NGU1MWI4NTk5NjA3/ODY1ZDExMi5qcGc",
    groupId: 1,
    groupName: "Photography Enthusiasts",
  },
  {
    id: 2,
    title: "Weekend Hike",
    description: "Moderate difficulty, 8-mile trail with beautiful views.",
    date: "2023-04-22T09:00:00Z",
    location: "Mountain Ridge Trail",
    organizer: {
      id: 1,
      name: "John Doe",
      avatar: "/uploads/profile.jpeg",
    },
    attendees: {
      going: [2],
      notGoing: [],
    },
    image:
      "https://imgs.search.brave.com/jLfYC2vnVrdKM1pTa5AmFzHt4c7QNiv3c6zQe-UtXoA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcm9t/by5jb20vdG9vbHMv/aW1hZ2UtcmVzaXpl/ci9zdGF0aWMvUGF0/dGVybl9pbWFnZS04/YzA1MDA1M2VhYjg4/NGU1MWI4NTk5NjA3/ODY1ZDExMi5qcGc",
    groupId: 2,
    groupName: "Hiking Adventures",
  },
  {
    id: 3,
    title: "Music Production Masterclass",
    description:
      "Learn from industry professionals about music production techniques.",
    date: "2023-05-05T18:30:00Z",
    location: "Downtown Studio",
    organizer: {
      id: 3,
      name: "Mike Johnson",
      avatar: "/uploads/profile.jpeg",
    },
    attendees: {
      going: [1, 2],
      notGoing: [],
    },
    image:
      "https://imgs.search.brave.com/jLfYC2vnVrdKM1pTa5AmFzHt4c7QNiv3c6zQe-UtXoA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcm9t/by5jb20vdG9vbHMv/aW1hZ2UtcmVzaXpl/ci9zdGF0aWMvUGF0/dGVybl9pbWFnZS04/YzA1MDA1M2VhYjg4/NGU1MWI4NTk5NjA3/ODY1ZDExMi5qcGc",
    groupId: 3,
    groupName: "Music Producers",
  },
];

export default async function EventsPage() {
  // const currentUser = await getCurrentUser();

  const currentUser = {
    id: 1,
    email: "john@example.com",
    password: "password123",
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "1990-05-15",
    nickname: "JD",
    aboutMe: "Software developer and hiking enthusiast",
    avatar: "/uploads/profile.jpeg0",
    isPublic: true,
    followers: [2, 3],
    following: [2],
    createdAt: "2023-01-15T08:30:00Z",
  };

  if (!currentUser) {
    return null; // This should be handled by middleware
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <>
      <div>
        <ShowEventForm />
        <h1>EVENTS</h1>
      </div>
      <div className={styles.eventsContainer}>
        <div className={styles.eventsHeader}>
          <h1>Events</h1>
          <Link href="/events" className={styles.createEventButton}>
            <IoAddOutline size={20} />
            Create EventO
          </Link>
        </div>

        <div className={styles.eventsTabs}>
          <button className={`${styles.tabButton} ${styles.activeTab}`}>
            Upcoming
          </button>
          <button className={styles.tabButton}>Past</button>
          <button className={styles.tabButton}>My Events</button>
        </div>

        <div className={styles.eventsGrid}>
          {sampleEvents.map((event) => (
            <div key={event.id} className={styles.eventCard}>
              <div className={styles.eventCardImage}>
                <Image width={200} height={100} src={event.image || "/placeholder.svg"} alt={event.title} />
                <div className={styles.eventDate}>
                  <div className={styles.eventMonth}>
                    {new Date(event.date).toLocaleString("default", {
                      month: "short",
                    })}
                  </div>
                  <div className={styles.eventDay}>
                    {new Date(event.date).getDate()}
                  </div>
                </div>
              </div>
              <div className={styles.eventCardContent}>
                <h3 className={styles.eventCardTitle}>{event.title}</h3>
                <div className={styles.eventCardMeta}>
                  <div className={styles.eventTime}>{formatDate(event.date)}</div>
                  <div className={styles.eventLocation}>{event.location}</div>
                  <div className={styles.eventGroup}>
                    <Link href={`/groups/${event.groupId}`}>
                      {event.groupName}
                    </Link>
                  </div>
                </div>
                <p className={styles.eventCardDescription}>{event.description}</p>
                <div className={styles.eventCardFooter}>
                  <div className={styles.eventAttendees}>
                    <span>{event.attendees.going.length} going</span>
                  </div>
                  <div className={styles.eventActions}>
                    <button className={styles.goingButton}>Going</button>
                    <button className={styles.notGoingButton}>Not Going</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
          <FloatingChat currentUser={currentUser} />
      </div>
    </>
  );
}
