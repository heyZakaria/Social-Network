"use client"

import ShowEventForm from "@/components/newEvent"
import GroupChat from "@/components/groupChat"
import UpcomingEvents from "@/components/upcoming-events"


export default function Event() {
    return <>
        <h1>Welcome to Events page</h1>

        <ShowEventForm />
        
        <GroupChat />

        <UpcomingEvents />

    </>
} 