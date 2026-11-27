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
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: [
            // sparse bright layer
            `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='420' height='420'%3E%3Cg fill='%23cfe4ff'%3E%3Ccircle cx='32' cy='54' r='1.6'/%3E%3Ccircle cx='150' cy='23' r='1.1' opacity='.8'/%3E%3Ccircle cx='256' cy='90' r='1.8'/%3E%3Ccircle cx='380' cy='41' r='1' opacity='.7'/%3E%3Ccircle cx='76' cy='180' r='1.2' opacity='.8'/%3E%3Ccircle cx='200' cy='240' r='1.6'/%3E%3Ccircle cx='330' cy='200' r='1' opacity='.7'/%3E%3Ccircle cx='404' cy='150' r='1.4' opacity='.9'/%3E%3Ccircle cx='110' cy='330' r='1.5'/%3E%3Ccircle cx='290' cy='360' r='1.1' opacity='.8'/%3E%3Ccircle cx='20' cy='280' r='1' opacity='.7'/%3E%3Ccircle cx='170' cy='130' r='.9' opacity='.6'/%3E%3Ccircle cx='250' cy='20' r='.9' opacity='.6'/%3E%3Ccircle cx='360' cy='300' r='1.2' opacity='.8'/%3E%3C/g%3E%3C/svg%3E")`,
            // dense faint layer
            `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260'%3E%3Cg fill='%23a9c2e0'%3E%3Ccircle cx='14' cy='40' r='.7' opacity='.55'/%3E%3Ccircle cx='60' cy='10' r='.6' opacity='.45'/%3E%3Ccircle cx='95' cy='66' r='.8' opacity='.6'/%3E%3Ccircle cx='140' cy='30' r='.6' opacity='.4'/%3E%3Ccircle cx='185' cy='80' r='.7' opacity='.55'/%3E%3Ccircle cx='230' cy='18' r='.6' opacity='.45'/%3E%3Ccircle cx='40' cy='120' r='.8' opacity='.5'/%3E%3Ccircle cx='110' cy='150' r='.6' opacity='.45'/%3E%3Ccircle cx='170' cy='130' r='.8' opacity='.6'/%3E%3Ccircle cx='225' cy='170' r='.6' opacity='.4'/%3E%3Ccircle cx='25' cy='210' r='.7' opacity='.55'/%3E%3Ccircle cx='85' cy='240' r='.6' opacity='.4'/%3E%3Ccircle cx='150' cy='220' r='.8' opacity='.6'/%3E%3Ccircle cx='205' cy='245' r='.6' opacity='.45'/%3E%3Ccircle cx='245' cy='115' r='.7' opacity='.5'/%3E%3Ccircle cx='65' cy='180' r='.5' opacity='.35'/%3E%3Ccircle cx='130' cy='95' r='.5' opacity='.35'/%3E%3Ccircle cx='200' cy='50' r='.5' opacity='.35'/%3E%3C/g%3E%3C/svg%3E")`,
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
