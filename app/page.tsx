"use client";

import { useEffect, useRef, useState } from "react";

type Orbit = {
  id: string;
  label: string;
  radius: number; // 0-100 relative
  color: string;
  blurb: string;
  entries: string[];
};

const ORBITS: Orbit[] = [
  {
    id: "first-year",
    label: "1ST YEAR",
    radius: 92,
    color: "#4a79bb",
    blurb:
      "The outermost ring — the slowest orbit. Foundations: CC 101, CC 102, DS 101, PL 101. Every later year assumed I spoke this language.",
    entries: ["CC 101 · Introduction to Computing", "CC 102 · Computer Programming 1", "DS 101 · Discrete Structure 1", "PL 101 · Programming Languages"],
  },
  {
    id: "second-year",
    label: "2ND YEAR",
    radius: 70,
    color: "#5f92cc",
    blurb:
      "Orbit tightens. Data structures, OOP, the first security classes — velocity increasing, interviews beginning to make sense.",
    entries: ["CC 104 · Data Structures and Algorithms", "SDF 104 · Object-Oriented Programming", "IAS 101 · Information Assurance 1", "AL 101 · Algorithms and Complexity", "AL 102 · Automata Theory"],
  },
  {
    id: "third-year",
    label: "3RD YEAR",
    radius: 48,
    color: "#e6f1ff",
    blurb:
      "Inner system. Operating systems, HCI, networks, distributed computing — the heaviest matter: real systems thinking, real trade-offs.",
    entries: ["OS 101 · Operating Systems", "AR 101 · Architecture and Organization", "HCI 101 · Human-Computer Interaction 1", "NC 101 · Networks and Communications", "PD 101 · Parallel and Distributed Computing"],
  },
  {
    id: "ojt-era",
    label: "OJT",
    radius: 26,
    color: "#ff3e1f",
    blurb:
      "The crossing. Beyond this ring there is no return to 'student only' — Career Team, then Thorne: real platforms, real users, real interviews.",
    entries: ["Career Team LLC · Software Engineer", "Thorne Consulting · Interim Lead Engineer"],
  },
];

function Ring({
  orbit,
  isActive,
}: {
  orbit: Orbit;
  isActive: boolean;
}) {
  return (
    <g>
      <circle
        cx="500"
        cy="500"
        r={orbit.radius * 4.6}
        fill="none"
        stroke={orbit.color}
        strokeOpacity={isActive ? 0.9 : 0.35}
        strokeWidth={isActive ? 2 : 1}
        strokeDasharray={orbit.id === "ojt-era" ? undefined : "2 7"}
      />
      <text
        x="500"
        y={500 - orbit.radius * 4.6 - 14}
        textAnchor="middle"
        fontSize="17"
        letterSpacing="6"
        fill={isActive ? "#ffc857" : orbit.color}
        opacity={isActive ? 1 : 0.6}
      >
        {orbit.label}
      </text>
      <circle
        cx={500 + orbit.radius * 4.6 * 0.42}
        cy={500 - orbit.radius * 4.6 * 0.91}
        r={isActive ? 9 : 5}
        fill={isActive ? "#ffc857" : orbit.color}
        className="transition-all duration-700"
      />
    </g>
  );
}

export default function HorizonPage() {
  const [active, setActive] = useState<string>("first-year");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );
    Object.values(sectionRefs.current).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-[#07070a] text-[#e6f1ff] selection:bg-[#ffc857] selection:text-[#07070a]">
      {/* orbital system — fixed backdrop on desktop; on mobile it lives only
          behind the hero so rings never fight the chapter text */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-[92vh] overflow-hidden opacity-40 sm:opacity-100 pointer-events-none
                   sm:fixed sm:inset-0 sm:h-auto sm:flex sm:items-center sm:justify-center"
      >
        <svg
          viewBox="0 0 1000 1000"
          className="w-[150vmin] h-[150vmin] sm:w-[190vmin] sm:h-[190vmin] max-w-none transition-transform duration-700 ease-out"
          style={{
            transform: `scale(${
              active === "first-year" ? 1.15 :
              active === "second-year" ? 1.0 :
              active === "third-year" ? 0.85 :
              active === "ojt-era" ? 0.7 : 0.55
            })`,
          }}
        >
          {/* the singularity */}
          <circle cx="500" cy="500" r="34" fill="#ffc857" opacity="0.95" />
          <circle cx="500" cy="500" r="26" fill="#07070a" />
          <circle cx="500" cy="500" r="120" fill="none" stroke="#223247" strokeWidth="1" />
          {ORBITS.map((o) => (
            <Ring key={o.id} orbit={o} isActive={active === o.id} />
          ))}
        </svg>
        {/* mobile scrim: fade the ring band into solid ground before content starts */}
        <div className="sm:hidden absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-[#07070a]" />
      </div>

      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none opacity-[0.05]"
        style={{
          background:
            "radial-gradient(circle at 80% 10%, #4a79bb 0%, transparent 40%), radial-gradient(circle at 20% 90%, #ff3e1f 0%, transparent 45%)",
        }}
      />

      {/* header */}
      <header className="relative flex flex-wrap items-baseline justify-between gap-3 px-5 sm:px-10 py-6">
        <p className="tracking-[0.5em] text-sm">
          NEIL JUSTIN MALLARI
          <span className="block text-[10px] tracking-[0.34em] text-[#4a79bb] mt-1">
            A JOURNEY PAST THE POINT OF NO RETURN
          </span>
        </p>
        <nav className="flex gap-5 text-[11px] tracking-[0.25em] text-[#8fa8c0]">
          <a className="hover:text-[#ffc857]" href="/">HOME</a>
          <a className="hover:text-[#ffc857]" href="#first-year">POSTS</a>
          <a className="hover:text-[#ffc857]" href="#about">ABOUT</a>
          <a className="hover:text-[#ffc857]" href="#contact">CONTACT</a>
        </nav>
      </header>

      {/* hero + chapters: the inward fall — content rail offset left, disk rides right on desktop */}
      <div className="relative mx-auto max-w-2xl sm:px-10 px-5 pb-40 lg:mx-0 lg:ml-[8vw]">
        <section className="pt-[28vh] sm:pt-[30vh]" id="intro">
          <p className="text-[11px] tracking-[0.4em] text-[#4a79bb]">OBSERVE THE RECORD</p>
          <h1 className="mt-6 text-4xl sm:text-6xl font-extralight leading-tight">
            Four years in orbit.
            <br />
            OJT: <span className="font-semibold text-[#ffc857]">no return.</span>
          </h1>
          <p className="mt-6 text-sm sm:text-lg text-[#8fa8c0] leading-relaxed font-light">
            A computer science journey held in stable orbit — 1st year to 4th, matter
            circling the horizon where student became engineer.
            <span className="text-[#e6f1ff]"> Scroll to fall inward.</span>
          </p>
        </section>

        {ORBITS.map((o) => (
          <section
            key={o.id}
            id={o.id}
            ref={(el) => {
              sectionRefs.current[o.id] = el;
            }}
            className="pt-[60vh] scroll-mt-10"
          >
            <div
              className={`border p-6 sm:p-8 backdrop-blur-sm transition-colors duration-700 ${
                active === o.id ? "border-[#ffc857]/60" : "border-[#223247]"
              } bg-[#07070a]/95 sm:bg-[#07070a]/60`}
            >
              <p className="text-[10px] tracking-[0.4em]" style={{ color: o.color }}>
                {active === o.id ? "● NOW ORBITING" : "RING"} — {o.label}
              </p>
              <p className="mt-4 text-sm sm:text-base text-[#c8d6e5] leading-relaxed font-light">
                {o.blurb}
              </p>
              <ul className="mt-5 space-y-2">
                {o.entries.map((entry) => (
                  <li
                    key={entry}
                    className="text-[13px] text-[#8fa8c0] flex items-baseline gap-3"
                  >
                    <span className="text-[#ffc857]">◦</span>
                    {entry}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[11px] tracking-[0.25em] text-[#4a79bb]">
                READ THE CHAPTER →
              </p>
            </div>
          </section>
        ))}

        {/* the horizon crossing */}
        <section
          id="reflection"
          ref={(el) => {
            sectionRefs.current["reflection"] = el;
          }}
          className="pt-[60vh] scroll-mt-10"
        >
          <div
            className={`border p-6 sm:p-8 backdrop-blur-sm transition-colors duration-700 ${
              active === "reflection" ? "border-[#ffc857]" : "border-[#223247]"
            } bg-[#07070a]/95 sm:bg-[#07070a]/70`}
          >
            <p className="text-[10px] tracking-[0.4em] text-[#ffc857]">
              ● EVENT HORIZON — FINAL REFLECTION
            </p>
            <h2 className="mt-4 text-2xl sm:text-3xl font-extralight leading-snug">
              Past this ring, nothing escapes unchanged.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#c8d6e5] font-light leading-relaxed">
              The final reflection — what four years of orbits and one era of real
              work actually taught. Written from the other side.
            </p>
          </div>

          {/* anchors for the required pages, landing below the record */}
          <div id="about" className="scroll-mt-10" />
          <div id="contact" className="scroll-mt-10" />

          <p className="mt-16 text-center text-[10px] tracking-[0.34em] text-[#223247]">
            — SINGULARITY —
          </p>
        </section>
      </div>
    </main>
  );
}
