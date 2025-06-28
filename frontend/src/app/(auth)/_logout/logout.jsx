"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutUser() {
  // Clear cookie
  try{
    
   const response = await fetch("/api/logout", {
      method: "GET",
    });
    const data = await response.json();
    console.log("Logout response data:", data);
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to log out");
    }
    console.log("Logout successful:", data);
    return true
  } catch (error) {
    console.error("Error logging out:", error);
    return false
  }
//   redirect("/login");
}


