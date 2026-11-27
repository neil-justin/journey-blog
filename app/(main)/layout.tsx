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
      {/* static CSS starfield — atmosphere without competing with the homepage world */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-70"
        style={{
          backgroundImage: [
            "radial-gradient(1px 1px at 12% 22%, rgba(207,228,255,0.7) 50%, transparent 51%)",
            "radial-gradient(1px 1px at 28% 64%, rgba(207,228,255,0.45) 50%, transparent 51%)",
            "radial-gradient(2px 2px at 41% 15%, rgba(207,228,255,0.6) 50%, transparent 51%)",
            "radial-gradient(1px 1px at 55% 47%, rgba(207,228,255,0.4) 50%, transparent 51%)",
            "radial-gradient(1.5px 1.5px at 67% 78%, rgba(207,228,255,0.55) 50%, transparent 51%)",
            "radial-gradient(1px 1px at 74% 29%, rgba(207,228,255,0.5) 50%, transparent 51%)",
            "radial-gradient(2px 2px at 86% 58%, rgba(207,228,255,0.65) 50%, transparent 51%)",
            "radial-gradient(1px 1px at 93% 12%, rgba(207,228,255,0.45) 50%, transparent 51%)",
            "radial-gradient(1px 1px at 7% 84%, rgba(207,228,255,0.4) 50%, transparent 51%)",
            "radial-gradient(1.5px 1.5px at 48% 91%, rgba(207,228,255,0.5) 50%, transparent 51%)",
          ].join(", "),
        }}
      />
      {/* faint glow — memory of the horizon, no orbit */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_85%_80%,rgba(74,121,187,0.14)_0%,transparent_55%)]"
      />

      <div className="relative z-10">
        <header className="sticky top-0 z-20 flex flex-wrap items-baseline justify-between gap-3 border-b border-[#161f2e] bg-[#07070a]/80 px-5 py-6 backdrop-blur-md sm:px-10">
          <Link href="/" className="font-mono tracking-[0.5em] text-sm">
            NEIL JUSTIN MALLARI
          </Link>
          <SiteNav />
        </header>
        <main className="mx-auto max-w-2xl sm:px-10 px-5 pb-40">
          {children}
        </main>
      </div>
    </div>
  );
}
