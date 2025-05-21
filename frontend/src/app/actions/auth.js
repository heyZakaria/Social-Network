"use server"

import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export async function logoutUser() {
  // Clear cookie
  cookies().set("sessionId", "", {
    expires: new Date(0),
    path: "/",
  })

  // Redirect to login page
  redirect("/login")
}

