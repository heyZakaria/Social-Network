"use client"
import { useState } from "react";
import Link from "next/link";
import { IoAddOutline } from "react-icons/io5";
import styles from "@/styles/UpcomingEvents.module.css";
import { useParams } from "next/navigation";
import { useFriends } from "@/context/friends_context";


let groupId
export default function UpcomingEvents() {
  const { HandleEventPresence } = useFriends()
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  const p = useParams()
  groupId = p.id

  const HandleGetEvents = async () => {
    try {
      const e = await fetchEvents();
      setEvents(e);
    } catch (error) {
      console.error("Error fetching events:", error.message);
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  
  return (
    <div className={styles.eventsContainer}>
      <div className={styles.eventsHeader}>
        <h1>Events</h1>
        <button onClick={HandleGetEvents} className={styles.createEventButton}>
          <IoAddOutline size={20} />
          Get Events
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.eventGrid}>
        {events.length === 0 ? (
          <p>No events found. Click Get Events to load.</p>
        ) : (
          events?.map((event) => (
            <div key={event.id} className={styles.eventCard}>
              <div className={styles.eventCardContent}>
                <h3 className={styles.eventCardTitle}>{event.title}</h3>
                <div className={styles.eventCardMeta}>
                  <div className={styles.eventTime}>{formatDate(event.date)}</div>
                  <div className={styles.eventLocation}>{event.location}</div>
                  <div className={styles.eventGroup}>
                    <Link href={`/groups/${event.group_id}`}>
                      {event.group_name}
                    </Link>
                  </div>
                </div>
                <p className={styles.eventCardDescription}>{event.description}</p>
                <div className={styles.eventCardFooter}>
                  <div className={styles.eventAttendees}>
                    <span>{event.attendees || 0} going</span>
                  </div>
                  <div className={styles.eventActions}>
                    <button onClick={() => HandleEventPresence(groupId, event.id, "going")} className={styles.goingButton}> Going</button>
                    <button onClick={() => HandleEventPresence(groupId, event.id, "not going")} className={styles.notGoingButton}>Not Going</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


export const fetchEvents = async () => {

  const res = await fetch(`/api/groups/events/${groupId}`, {
    method: "GET",
    credentials: "include",

    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (res) => {
      if (!res.ok) {
        return res.json().then((errData) => {
          throw new Error(errData.error || "Event fetch failed");
        });
      }
      return res.json();
    })
    .then((data) => {
      // console.log("Weeeeeeeeeeee EVENTS 2", data);
      return data
   
    })
    .catch((error) => {
      console.error("Error fetching events:", error.message);
      setError(error.message);
    });
};