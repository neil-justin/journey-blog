"use client";

import Link from "next/link";

const LINKS = [
  { href: "/", label: "HOME" },
  { href: "/posts", label: "POSTS" },
  { href: "/about", label: "ABOUT" },
  { href: "/contact", label: "CONTACT" },
];

export default function SiteNav() {
  return (
    <nav className="flex gap-5 text-[13px] tracking-[0.22em] text-[#8fa8c0] font-mono">
      {LINKS.map((l) => (
        <Link key={l.href} className="hover:text-[#ffc857]" href={l.href}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
