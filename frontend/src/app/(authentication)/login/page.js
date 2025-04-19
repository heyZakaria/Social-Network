"use client"

import NavBar from "@/components/Navbar";
import Link from "next/link";


export default function ShowLogin() {
    return (
        <form >
            

            <label>Email:</label><br />
            <input
                name="email"
                placeholder="example@cnss.ma"
                type="email"
                className="email"
            />
            <br />

            <label>Password:</label><br />
            <input
                name="password"
                placeholder="example@cnss.ma"
                type="password"
                className="password"
            />
            <br /> <button type="submit">Login</button>
            <br />
            <br />
            <Link href="/register">Create new account?</Link>
        </form>
    );
}