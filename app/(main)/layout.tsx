import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import SiteNav from "../components/SiteNav";

export const metadata: Metadata = {
  title: "Neil Justin Mallari — Journey Blog",
  description: "My journey as a computer science student — from 1st year to OJT.",
};

export default function InnerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#07070a] text-[#e6f1ff] selection:bg-[#ffc857] selection:text-[#07070a]">
      <div className="relative z-10">
        <header className="sticky top-0 z-20 flex flex-wrap items-baseline justify-between gap-3 border-b border-[#161f2e] bg-[#07070a]/80 px-5 py-6 backdrop-blur-md sm:px-10">
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
