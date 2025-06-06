"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutUser() {
  // Clear cookie
  cookies().set("token", "", {
    expires: new Date(0),
    path: "/",
    value: "",
  });

//   redirect("/login");
}


