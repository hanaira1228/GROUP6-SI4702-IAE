"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed flex justify-center gap-10 py-6 font-medium text-pink-700 bg-pink-100 w-full z-50 shadow-sm">
      <Link href="/" className="hover:text-pink-500 font-bold">HOME</Link>
      <Link href="/menu" className="hover:text-pink-500 font-bold">MENU</Link>
      <Link href="/restaurant" className="hover:text-pink-500 font-bold">RESTAURANT</Link>
      <Link href="/input" className="hover:text-pink-500 font-bold">INPUT</Link>
      <Link href="/user" className="hover:text-pink-500 font-bold">USER</Link>
    </nav>
  );
}