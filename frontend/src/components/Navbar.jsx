"use client";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();
  const hideNavBar = pathname === '/login' || pathname === '/register' || pathname === '/home';
  
  if (hideNavBar) {
    return null;
  }
  
  return (
    <>
      <nav>
        <div className="logo">
          <Link href="/"><h1>SocialNetwork</h1></Link>
        </div>
        <div className="NavbarLinks">
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </div>
      </nav>
    </>
  );
}