"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import db from "@/lib/mock-data"


export async function logoutUser() {
  const sessionId = cookies().get("sessionId")?.value

  if (sessionId) {
    // Delete session
    db.sessions.delete(sessionId)
  }

  // Clear cookie
  cookies().set("sessionId", "", {
    expires: new Date(0),
    path: "/",
  })

  // Redirect to login page
  redirect("/login")
}

export async function getCurrentUser() {
  const sessionId = cookies().get("sessionId")?.value

  if (!sessionId) {
    return null
  }

  const session = db.sessions.get(sessionId)
  if (!session) {
    return null
  }

  const user = db.users.findById(session.userId)
  if (!user) {
    return null
  }

  // Don't return the password
  const { password, ...userWithoutPassword } = user
  return userWithoutPassword
}
