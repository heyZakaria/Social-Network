import Link from "next/link"
import styles from "@/app/styles/upcoming-events.module.css"
export default function UpcomingEvents({ events = ["wee"] }) {

    if (events.length === 0) {
        return (
            <div className={styles.container}>
                <h3 className={styles.title}>Upcoming Events</h3>
                <p>No upcoming events.</p>
                <button onClick={CreateEvent} className={styles.seeAll}>
                    Create an Event
                </button>
            </div>
        )
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const options = { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
        return date.toLocaleDateString("en-US", options)
    }

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Upcoming Events</h3>
            <div className={styles.list}>
                {events.slice(0, 3).map((event) => (
                    <Link href={`/events/${event.id}`} key={event.id}>
                        <div className={styles.item}>
                            <div className={styles.eventDate}>
                                <div className={styles.eventMonth}>
                                    {new Date(event.date).toLocaleString("default", { month: "short" }).toUpperCase()}
                                </div>
                                <div className={styles.eventDay}>{new Date(event.date).getDate()}</div>
                            </div>
                            <div className={styles.info}>
                                <div className={styles.name}>{event.title}</div>
                                <div className={styles.meta}>
                                    <span>{formatDate(event.date)}</span>
                                    <span className={styles.eventLocation}>{event.location}</span>
                                    <span className={styles.eventAttendees}>{event.attendees} going</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            {events.length > 3 && (
                <Link href="/events" className={styles.seeAll}>
                    See All Events
                </Link>
            )}
        </div>
    )
}



const CreateEvent = (e) => {
    e.preventDefault()
    console.log("Create Event")
}