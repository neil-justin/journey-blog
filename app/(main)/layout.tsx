import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import WorldCanvas from "../components/WorldCanvas";
import SiteNav from "../components/SiteNav";

export const metadata: Metadata = {
  title: "Neil Justin Mallari — Journey Blog",
  description: "My journey as a computer science student — from 1st year to OJT.",
};

export default function InnerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#07070a] text-[#e6f1ff] selection:bg-[#ffc857] selection:text-[#07070a]">
      {/* same Event Horizon world as the homepage — desktop only; mobile keeps solid ground */}
      <div className="hidden md:block">
        <WorldCanvas mode="ambient" />
      </div>
      <div
        aria-hidden
        className="fixed inset-0 z-[1] hidden md:block pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(7,7,10,0.9) 0%, rgba(7,7,10,0.6) 35%, transparent 60%)",
        }}
      />
      {/* mobile: static on-world glow instead of WebGL */}
      <div
        aria-hidden
        className="fixed inset-0 z-0 md:hidden bg-[radial-gradient(ellipse_at_50%_30%,#1a2a4a_0%,#07070a_65%)]"
      />

      <div className="relative z-10">
        <header className="flex flex-wrap items-baseline justify-between gap-3 px-5 sm:px-10 py-6">
          <Link href="/" className="font-mono tracking-[0.5em] text-sm">
            NEIL JUSTIN MALLARI
            <span className="block text-[10px] tracking-[0.34em] text-[#4a79bb] mt-1">
              MY JOURNEY FROM 1ST YEAR TO OJT
            </span>
          </Link>
          <SiteNav />
        </header>
        <main className="mx-auto max-w-2xl sm:px-10 px-5 pb-40 lg:mx-0 lg:ml-[6vw]">
          {children}
        </main>
      </div>
    </div>
  );
}
