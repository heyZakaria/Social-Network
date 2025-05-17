"use client"

import ShowEventForm from "@/components/newEvent"
import GroupChat from "@/components/groupChat"


export default function Event() {
    return <>
        <h1>Welcome to Events page</h1>

        <ShowEventForm />
        
        <GroupChat />

    </>
} 