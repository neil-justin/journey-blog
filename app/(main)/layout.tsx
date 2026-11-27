import type { Metadata } from "next";
import type { ReactNode } from "react";
import SiteNav from "../components/SiteNav";

export const metadata: Metadata = {
  title: "Neil Justin Mallari — Journey Blog",
  description: "My journey as a computer science student — from 1st year to OJT.",
};

export default function InnerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#07070a] text-[#e6f1ff] selection:bg-[#ffc857] selection:text-[#07070a]">
      {/* ambient backdrop — full 3D world arrives later; static glow keeps pages on-world */}
      <div
        aria-hidden
        className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_80%_10%,#1a2a4a_0%,transparent_55%),radial-gradient(ellipse_at_10%_90%,#0d1626_0%,transparent_50%)]"
      />
      <div className="relative z-10">
        <header className="flex flex-wrap items-baseline justify-between gap-3 px-5 sm:px-10 py-6">
          <a href="/" className="font-mono tracking-[0.5em] text-sm">
            NEIL JUSTIN MALLARI
            <span className="block text-[10px] tracking-[0.34em] text-[#4a79bb] mt-1">
              MY JOURNEY FROM 1ST YEAR TO OJT
            </span>
          </a>
          <SiteNav />
        </header>
        <main className="mx-auto max-w-2xl sm:px-10 px-5 pb-40">{children}</main>
      </div>
    </div>
  );
}
