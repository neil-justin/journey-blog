"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const LINKS = [
  { href: "/", label: "HOME" },
  { href: "/posts", label: "POSTS" },
  { href: "/about", label: "ABOUT" },
  { href: "/contact", label: "CONTACT" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // close when navigating
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      {/* mobile / tablet dropdown */}
      <div ref={rootRef} className="relative md:hidden">
        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center border border-[#1c2942] bg-[#0b1220] text-[#8fa8c0] transition-colors duration-200 hover:border-[#ffc857]/50 hover:text-[#ffc857]"
        >
          {/* hamburger that morphs into an X */}
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <line
              x1="3"
              y1="6"
              x2="21"
              y2="6"
              className={`origin-center transition-transform duration-300 ${
                open ? "translate-y-[6px] rotate-45" : ""
              }`}
            />
            <line
              x1="3"
              y1="12"
              x2="21"
              y2="12"
              className={`transition-opacity duration-200 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <line
              x1="3"
              y1="18"
              x2="21"
              y2="18"
              className={`origin-center transition-transform duration-300 ${
                open ? "-translate-y-[6px] -rotate-45" : ""
              }`}
            />
          </svg>
        </button>

        {/* animated panel: always mounted, toggled with classes so it can fade */}
        <div
          role="menu"
          aria-hidden={!open}
          className={`absolute right-0 top-full z-30 mt-2 min-w-[10rem] origin-top-right border border-[#1c2942] bg-[#0b1220]/95 py-1 shadow-lg shadow-black/50 backdrop-blur-md transition-all duration-200 ease-out ${
            open
              ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
              : "pointer-events-none -translate-y-1 scale-95 opacity-0"
          }`}
        >
          {LINKS.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              role="menuitem"
              aria-current={isActive(pathname, l.href) ? "page" : undefined}
              style={{ transitionDelay: `${i * 30}ms` }}
              className={`block px-4 py-2 font-mono text-[11px] tracking-[0.25em] transition-colors duration-200 ${
                isActive(pathname, l.href)
                  ? "text-[#ffc857]"
                  : "text-[#8fa8c0] hover:bg-[#121a2a] hover:text-[#ffc857]"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      {/* desktop inline links */}
      <nav className="hidden gap-5 font-mono text-[11px] tracking-[0.25em] text-[#8fa8c0] md:flex">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={
              isActive(pathname, l.href)
                ? "text-[#ffc857]"
                : "hover:text-[#ffc857]"
            }
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
