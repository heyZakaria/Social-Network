"use client";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { HiHome, HiChatBubbleLeft, HiMiniBellAlert, HiMiniUserGroup, HiMiniUser, HiArrowRightOnRectangle } from "react-icons/hi2";

export default function NavBar() {
  const pathname = usePathname();
  const hideNavBar = pathname === '/login' || pathname === '/register';

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
          <Link href="/"> <HiHome size={20} /> </Link>
          <Link href="/"> <HiChatBubbleLeft size={20} /> </Link>
          <Link href="/"> <HiMiniBellAlert size={20} /> </Link>
          <Link href="/"> <HiMiniUserGroup size={20} /> </Link>
          <Link href="/"> <HiMiniUser size={20} /> </Link>
          <Link href="/"> <HiArrowRightOnRectangle size={20} color="red" /> </Link>
        </div>
      </nav>
    </>
  );
}

