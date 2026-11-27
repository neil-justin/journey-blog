"use client";

import WorldCanvas from "./components/WorldCanvas";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";

/* ---------------- content ---------------- */

const SECTIONS = [
  {
    id: "first-year",
    ring: 0,
    label: "1ST YEAR",
    status: "FOUNDATIONS",
    color: "#4a79bb",
    text: "The start. Basic subjects, first programs, first all-nighters. Everything after this year assumed I learned these well.",
    entries: [
      "CC 101 · Introduction to Computing",
      "CC 102 · Computer Programming 1",
      "DS 101 · Discrete Structure 1",
      "PL 101 · Programming Languages",
    ],
  },
  {
    id: "second-year",
    ring: 1,
    label: "2ND YEAR",
    status: "STRUCTURE",
    color: "#5f92cc",
    text: "Orbit tightens. Data structures, OOP, and my first security classes. School started to feel like real engineering.",
    entries: [
      "CC 104 · Data Structures and Algorithms",
      "SDF 104 · Object-Oriented Programming",
      "IAS 101 · Information Assurance and Security 1",
      "AL 101 · Algorithms and Complexity",
      "AL 102 · Automata Theory and Formal Languages",
    ],
  },
  {
    id: "third-year",
    ring: 2,
    label: "3RD YEAR",
    status: "SYSTEMS",
    color: "#e6f1ff",
    text: "The heavy subjects: operating systems, networks, HCI, distributed computing. This was also the year my real work life started.",
    entries: [
      "OS 101 · Operating Systems",
      "AR 101 · Architecture and Organization",
      "HCI 101 · Human-Computer Interaction 1",
      "NC 101 · Networks and Communications",
      "PD 101 · Parallel and Distributed Computing",
    ],
  },
  {
    id: "ojt-era",
    ring: 3,
    label: "OJT",
    status: "THE CROSSING",
    color: "#ff3e1f",
    text: "My on-the-job training era. Real companies, real users, real deadlines. This is where student work became engineering work.",
    entries: [
      "Career Team LLC · Software Engineer (May 2025 – Jun 2026)",
      "Thorne Consulting · Interim Lead Software Engineer (Mar 2026 – Sep 2026)",
    ],
  },
  {
    id: "fourth-year",
    ring: 4,
    label: "4TH YEAR",
    status: "NOW · SEM 1",
    color: "#ffc857",
    text: "Where I am now: thesis, software engineering 1 and 2, and the last subjects before graduation.",
    entries: [
      "SE 101 · Software Engineering 1 ← current",
      "HCI 102 · Human-Computer Interaction 2",
      "THS 102 · CS Thesis Writing 1",
      "SP 101 · Social Issues and Professional Practice",
    ],
  },
];

const SECTION_IDS = ["intro", ...SECTIONS.map((s) => s.id), "reflection"];

const NAV = [
  { href: "/", label: "HOME" },
  { href: "/posts", label: "POSTS" },
  { href: "/about", label: "ABOUT" },
  { href: "/contact", label: "CONTACT" },
];

export default function DeepHome() {
  const [progress, setProgress] = useState(0);
  const [activeRing, setActiveRing] = useState(0);
  const [active, setActive] = useState("intro");

  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
      let current = "intro";
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.55) current = id;
      }
      setActive(current);
      const idx = SECTIONS.findIndex((s) => s.id === current);
      setActiveRing(idx >= 0 ? idx : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const currentSection =
    SECTIONS.find((s) => s.id === active) ?? null;
  const traveled = Math.round(progress * 100);

  return (
    <main className="min-h-screen bg-[#07070a] text-[#e6f1ff] selection:bg-[#ffc857] selection:text-[#07070a]">
      {/* 3D layer */}
      <WorldCanvas mode="journey" hole progress={progress} activeRing={activeRing} />

      {/* left scrim: keeps the text column dark even when the disk glows */}
      <div
        aria-hidden
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(7,7,10,0.88) 0%, rgba(7,7,10,0.55) 30%, transparent 55%)",
        }}
      />

      {/* content */}
      <div className="relative z-10">
        <header className="sticky top-0 z-20 flex flex-wrap items-baseline justify-between gap-3 bg-[#07070a]/70 px-5 py-6 backdrop-blur-md sm:px-10">
          <p className="font-mono tracking-[0.5em] text-sm">
            NEIL JUSTIN MALLARI
          </p>
          <nav className="flex gap-5 text-[11px] tracking-[0.25em] text-[#8fa8c0] font-mono">
            {NAV.map((l) => (
              <Link key={l.href} className="hover:text-[#ffc857]" href={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>
        </header>

        <div className="mx-auto max-w-2xl sm:px-10 px-5 pb-40 lg:mx-0 lg:ml-[6vw]">
          {/* hero fills the first viewport, vertically centered */}
          <section
            id="intro"
            className="flex min-h-[calc(100svh-120px)] flex-col justify-center"
          >
            <p className="text-[11px] font-mono tracking-[0.4em] text-[#4a79bb] drop-shadow-[0_2px_8px_rgba(7,7,10,1)]">
              MY JOURNEY AS A CS STUDENT
            </p>
            <h1 className="mt-6 text-3xl sm:text-5xl leading-snug font-bold font-display drop-shadow-[0_2px_18px_rgba(7,7,10,0.95)]">
              From 1st year to{" "}
              <span className="text-[#ffc857]">OJT and beyond.</span>
            </h1>
            <p className="mt-6 text-sm sm:text-lg text-[#c8d6e5] leading-relaxed font-light max-w-lg drop-shadow-[0_2px_12px_rgba(7,7,10,1)]">
              This blog is my whole journey as a computer science student — the
              subjects, the projects, and my real work experience. Scroll down to
              travel through it. The closer you get to the center, the closer to
              graduation.
            </p>
          </section>

          {SECTIONS.map((o) => (
            <section key={o.id} id={o.id} className="pt-[65vh] scroll-mt-10">
              <div
                className={`border p-6 sm:p-8 backdrop-blur-md transition-colors duration-700 ${
                  active === o.id ? "border-[#ffc857]/60" : "border-[#223247]"
                } bg-[#07070a]/80`}
              >
                <p className="text-[10px] font-mono tracking-[0.4em]" style={{ color: o.color }}>
                  {active === o.id ? "● YOU ARE HERE" : "CHAPTER"} — {o.label}
                  {o.status.startsWith("NOW") ? " · " + o.status : ""}
                </p>
                <p className="mt-4 text-sm sm:text-base text-[#c8d6e5] leading-relaxed font-light">
                  {o.text}
                </p>
                <ul className="mt-5 space-y-2">
                  {o.entries.map((entry) => (
                    <li key={entry} className="text-[13px] text-[#8fa8c0] flex items-baseline gap-3">
                      <span className="text-[#ffc857]">◦</span>
                      {entry}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-[11px] font-mono tracking-[0.25em] text-[#4a79bb]">
                  READ THIS CHAPTER →
                </p>
              </div>
            </section>
          ))}

          <section id="reflection" className="pt-[65vh] scroll-mt-10">
            <div
              className={`border p-6 sm:p-8 backdrop-blur-md transition-colors duration-700 ${
                active === "reflection" ? "border-[#ffc857]" : "border-[#223247]"
              } bg-[#07070a]/85`}
            >
              <p className="text-[10px] tracking-[0.4em] text-[#ffc857]">
                ● EVENT HORIZON — FINAL REFLECTION
              </p>
              <h2 className="mt-4 text-2xl sm:text-3xl font-extralight leading-snug">
                One last post after everything.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#c8d6e5] font-light leading-relaxed">
                A final reflection on the whole trip — what four years and one
                career actually taught me.
              </p>
            </div>
            <p className="mt-16 text-center text-[10px] tracking-[0.34em] text-[#223247]">
              — CENTER OF THE GRAVITY WELL —
            </p>
          </section>
        </div>
      </div>

      {/* status gauge */}
      <div className="fixed bottom-5 right-5 z-10 border border-[#223247] bg-[#07070a]/70 px-3 py-1.5 text-[9px] sm:text-[10px] tracking-[0.3em] text-[#8fa8c0]/90 font-mono pointer-events-none">
        TRAVELED {traveled}% —{" "}
        <span className="text-[#ffc857]">
          NOW AT: {currentSection ? currentSection.label : active === "reflection" ? "HORIZON" : "START"}
        </span>
      </div>
    </main>
  );
}
