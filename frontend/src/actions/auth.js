"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import db from "@/lib/mock-data"

// Helper function to generate a random session ID
function generateSessionId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export async function registerUser(formData) {
  const email = formData.get("email")
  const password = formData.get("password")
  const firstName = formData.get("firstName")
  const lastName = formData.get("lastName")
  const day = formData.get("day")
  const month = formData.get("month")
  const year = formData.get("year")
  const nickname = formData.get("nickname") || ""
  const aboutMe = formData.get("aboutMe") || ""
  const avatar = formData.get("avatar") ? "/placeholder.svg?height=200&width=200" : ""

  // Validation
  if (!email || !password || !firstName || !lastName || !day || !month || !year) {
    return { success: false, message: "All required fields must be filled" }
  }

  // Check if user already exists
  if (db.users.findByEmail(email)) {
    return { success: false, message: "A user with this email already exists" }
  }

  // Create date of birth
  const dateOfBirth = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`

  // Create new user
  const newUser = db.users.create({
    email,
    password, // In a real app, you would hash this password
    firstName,
    lastName,
    dateOfBirth,
    nickname,
    aboutMe,
    avatar,
  })

  return { success: true, message: "Registration successful! You can now log in." }
}

export async function loginUser(formData) {
  const email = formData.get("email")
  const password = formData.get("password")
  const rememberMe = formData.get("rememberMe") === "on"

  // Validation
  if (!email || !password) {
    return { success: false, message: "Email and password are required" }
  }

  // Find user
  const user = db.users.findByEmail(email)

  if (!user || user.password !== password) {
    return { success: false, message: "Invalid email or password" }
  }

  // Create session
  const sessionId = db.sessions.create(user.id)
  const expiresAt = rememberMe
    ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    : new Date(Date.now() + 24 * 60 * 60 * 1000)

  // Set cookie
  cookies().set("sessionId", sessionId, {
    expires: expiresAt,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  })

  // Redirect to home page
  redirect("/")
}

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

// export async function getCurrentUser() {
//   const sessionId = cookies().get("sessionId")?.value

//   if (!sessionId) {
//     return null
//   }

//   const session = db.sessions.get(sessionId)
//   if (!session) {
//     return null
//   }

//   const user = db.users.findById(session.userId)
//   if (!user) {
//     return null
//   }

//   // Don't return the password
//   const { password, ...userWithoutPassword } = user
//   return userWithoutPassword
// }



export async function getCurrentUser() {
  // For development, return first mock user
  return db.users.findById(1)
}