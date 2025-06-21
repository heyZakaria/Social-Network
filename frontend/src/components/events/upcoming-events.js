import { useState } from "react";
import Link from "next/link";
import { IoAddOutline } from "react-icons/io5";
import styles from "@/styles/UpcomingEvents.module.css";
import { useParams } from "next/navigation";

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const currentUser = {
    id: 1,
    firstName: "John",
    lastName: "Doe",
  };

  const p = useParams()
  const groupId = p.id
  console.log("Weeeeeeeeeeee ID", groupId);


  const fetchEvents = () => {
    fetch(`http://localhost:8080/api/groups/events/${groupId}`, {
      method: "GET",
      credentials: "include",

      headers: {
        "Content-Type": "application/json",
      },
    })
      .then( async (res) => {
        if (!res.ok) {
          return res.json().then((errData) => {
            throw new Error(errData.error || "Event fetch failed");
          });
        }
        ///console.log("Weeeeeeeeeeee EVENTS 1", res.json());
        return res.json();
      })
      .then((data) => {
        console.log("Weeeeeeeeeeee EVENTS 2", data);

        setEvents(data);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching events:", error.message);
        setError(error.message);
      });
  };

  const HandleEventPresence = (event) => {
    console.log("ZZZZZZZZZZZZ", event, event.id);
    
    fetch(`http://localhost:8080/api/groups/event_presence/response`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        group_id: groupId,
        event_id: event.id,
        presence: event.presence
      })
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errData) => {
            throw new Error(errData.error || "Event presence err");
          });
        }

        return res.json();
      })
      .then((data) =>{
        console.log("WAAAAk WAAAAAAAAAAAAk", data);
        
      })
      .catch((error) => {
        console.error("Error fetching events:", error.message);
        setError(error.message);
      });
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
        <a onClick={fetchEvents} className={styles.createEventButton}>
          <IoAddOutline size={20} />
          Get Events
        </a>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.eventsGrid}>
        {events.length === 0 ? (
          <p>No events found. Click "Get Events" to load.</p>
        ) : (
          events.map((event) => (
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
                    <button onClick={() => HandleEventPresence({ id: event.id, presence: "going" })} className={styles.goingButton}> Going</button>
                    <button onClick={() => HandleEventPresence({ id: event.id, presence: "not going" })} className={styles.notGoingButton}>Not Going</button>
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
