import { useState } from "react";
import Link from "next/link";
import { IoAddOutline } from "react-icons/io5";
import styles from "@/styles/UpcomingEvents.module.css";

export default function UpcomingEvents() {
    const [events, setEvents] = useState([]); 
    const [error, setError] = useState(null);
    const currentUser = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
    };

    const fetchEvents = () => {
        fetch("http://localhost:8080/events/events", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (!res.ok) {
                    return res.json().then((errData) => {
                        throw new Error(errData.error || "Event fetch failed");
                    });
                }
                return res.json();
            })
            .then((data) => {
                setEvents(data); 
                setError(null);
            })
            .catch((error) => {
                console.error("Error fetching events:", error.message);
                setError(error.message);
            });
    };

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
                                        <Link href={`/groups/${event.groupId}`}>
                                            {event.groupName}
                                        </Link>
                                    </div>
                                </div>
                                <p className={styles.eventCardDescription}>{event.description}</p>
                                <div className={styles.eventCardFooter}>
                                    <div className={styles.eventAttendees}>
                                        <span>{event.attendees?.going?.length || 0} going</span>
                                    </div>
                                    <div className={styles.eventActions}>
                                        <button className={styles.goingButton}>Going</button>
                                        <button className={styles.notGoingButton}>Not Going</button>
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
