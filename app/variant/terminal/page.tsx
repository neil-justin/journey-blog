"use client";

import { useEffect, useRef, useState } from "react";

type Era = "1ST YEAR" | "2ND YEAR" | "3RD YEAR" | "OJT ERA" | "REFLECTION";

type Chapter = {
  id: string;
  era: Era;
  lines: { cmd: string; out: string[] }[];
};

const ERAS: Era[] = ["1ST YEAR", "2ND YEAR", "3RD YEAR", "OJT ERA", "REFLECTION"];

const CHAPTERS: Chapter[] = [
  {
    id: "first-year",
    era: "1ST YEAR",
    lines: [
      {
        cmd: "cat first-year/first-sem.log",
        out: [
          "CC 101 · Introduction to Computing ......... the machine under the machine",
          "CC 102 · Computer Programming 1 ............ first Hello World — third try",
          "DS 101 · Discrete Structure 1 .............. proofs, sets, humility",
          "PL 101 · Programming Languages ............. why languages look like this",
        ],
      },
      {
        cmd: "cat first-year/second-sem.log",
        out: [
          "CC 103 · Computer Programming 2 ............ the first real debugging night",
          "DS 102 · Discrete Structure 2 .............. graphs — all is graph",
          "CN 101 · Computational Science ............. math that computes back",
        ],
      },
    ],
  },
  {
    id: "second-year",
    era: "2ND YEAR",
    lines: [
      {
        cmd: "cat second-year/first-sem.log",
        out: [
          "CC 104 · Data Structures and Algorithms .... the subject that interviews ask about",
          "SDF 104 · Object-Oriented Programming ...... classes before I knew I'd need them",
          "IAS 101 · Information Assurance and Security  trust nothing, verify everything",
          "SF 101 · System Fundamentals ............... what an OS owes your code",
        ],
      },
      {
        cmd: "cat second-year/second-sem.log",
        out: [
          "AL 101 · Algorithms and Complexity ......... big-O stops being a quiz answer",
          "AL 102 · Automata Theory ................... the machine that reads machines",
          "IAS 102 · Information Assurance 2 .......... threat models over paranoia",
          "GV 101 · Graphics and Visual Computing ..... pixels with a job",
        ],
      },
    ],
  },
  {
    id: "third-year",
    era: "3RD YEAR",
    lines: [
      {
        cmd: "cat third-year/first-sem.log",
        out: [
          "OS 101 · Operating Systems ................. schedulers, deadlocks, kernel sympathy",
          "AR 101 · Architecture and Organization ..... the cache miss that explained everything",
          "CC 105 · Information Management ............ data before the database",
          "IS 101 · Intelligent Systems ............... machines that guess — carefully",
        ],
      },
      {
        cmd: "cat third-year/second-sem.log",
        out: [
          "HCI 101 · Human-Computer Interaction 1 ..... the user is not the enemy",
          "NC 101 · Networks and Communications ....... it's always DNS, eventually",
          "CC 106 · Application Development ........... shipping beats theorizing",
          "PD 101 · Parallel and Distributed Computing . threads ruin everything",
        ],
      },
    ],
  },
  {
    id: "ojt-era",
    era: "OJT ERA",
    lines: [
      {
        cmd: "tail -f ojt-era.log",
        out: [
          "Career Team LLC · Software Engineer ........ multi-tenant platform, 1000s of users",
          "  └─ NestJS · Next.js · MongoDB ............ fixed the queries the dashboard feared",
          "Thorne Consulting · Interim Lead Engineer .. ~55 interviews, 2 interns mentored",
          "  └─ planned schemas and contracts ......... reviewed what shipped against them",
        ],
      },
    ],
  },
  {
    id: "reflection",
    era: "REFLECTION",
    lines: [
      {
        cmd: "cat reflection/final.md",
        out: [
          "Four years of subjects, one era of real work.",
          "The lesson compiles: everything they taught assumed",
          "I would one day build things people rely on.",
          "I do. That was the point.",
        ],
      },
    ],
  },
];

/** Types a block of text lines character by character once `active` flips true. */
function useTyped(active: boolean, fullText: string, speed = 6) {
  const [text, setText] = useState(active ? fullText : "");
  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(fullText);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 3;
      setText(fullText.slice(0, i));
      if (i >= fullText.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [active, fullText, speed]);
  return text;
}

function ChapterBlock({ chapter }: { chapter: Chapter }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: "-10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const fullText = chapter.lines
    .map((l) => `neil@journey:~$ ${l.cmd}\n${l.out.join("\n")}`)
    .join("\n\n");
  const typed = useTyped(seen, fullText);

  return (
    <section ref={ref} id={chapter.id} className="scroll-mt-24">
      <p className="text-[#176e3a] tracking-[0.3em] text-xs mt-14">
        ── {chapter.era} ──────────────────────────────
      </p>
      <pre className="whitespace-pre-wrap text-[13px] sm:text-[15px] leading-relaxed mt-3">
        {typed}
        {typed.length < fullText.length && typed.length > 0 && (
          <span className="inline-block w-[10px] h-[18px] bg-[#33ff66] align-middle animate-pulse" />
        )}
      </pre>
    </section>
  );
}

export default function TerminalPage() {
  const [history, setHistory] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  function runCommand(raw: string) {
    const cmd = raw.trim();
    if (!cmd) return;
    let reply = `command not found: ${cmd} — try 'help'`;
    const lower = cmd.toLowerCase();
    if (lower === "help") {
      reply = "available: ls (list chapters) · goto <first-year|second-year|third-year|ojt-era|reflection> · search <text> (future: full-text)";
    } else if (lower === "ls") {
      reply = CHAPTERS.map((c) => `./${c.id}`).join("\n");
    } else if (lower.startsWith("goto ")) {
      const target = CHAPTERS.find((c) => c.id === lower.slice(5).trim());
      if (target) {
        document.getElementById(target.id)?.scrollIntoView({ behavior: "smooth" });
        reply = `navigating to ${target.era.toLowerCase()}…`;
      } else {
        reply = `no such chapter — try: ${CHAPTERS.map((c) => c.id).join(" · ")}`;
      }
    }
    setHistory((h) => [...h, `$ ${cmd}`, reply]);
    setInput("");
    requestAnimationFrame(() =>
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
    );
  }

  return (
    <main className="min-h-screen bg-[#020805] text-[#33ff66] font-mono selection:bg-[#33ff66] selection:text-[#020805]">
      {/* phosphor glow + scanline atmosphere */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(51,255,102,0.06), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none opacity-[0.06]"
        style={{
          background:
            "repeating-linear-gradient(0deg, #33ff66 0px, #33ff66 1px, transparent 1px, transparent 3px)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-5 sm:px-8 py-10">
        {/* top bar */}
        <header className="flex flex-wrap items-baseline justify-between gap-3 border-b border-dashed border-[#176e3a] pb-4">
          <p className="text-sm sm:text-base">
            <span className="text-[#33ff66] font-bold">NEIL JUSTIN MALLARI</span>
            <span className="text-[#176e3a]"> — TTY1 · A JOURNEY, TYPED LIVE</span>
          </p>
          <nav className="flex gap-4 text-xs tracking-[0.2em] text-[#176e3a]">
            <a className="hover:text-[#33ff66]" href="#first-year">JOURNEY</a>
            <a className="hover:text-[#33ff66]" href="#ojt-era">OJT</a>
            <a className="hover:text-[#33ff66]" href="#reflection">REFLECTION</a>
            <a className="hover:text-[#33ff66]" href="#">ABOUT</a>
            <a className="hover:text-[#33ff66]" href="#">CONTACT</a>
          </nav>
        </header>

        {/* hero: boots the journey */}
        <div className="mt-10">
          <p className="text-[#176e3a]">Last login: 1st year, 1st semester on tty1</p>
          <p className="mt-4 text-lg sm:text-2xl">
            <span className="text-[#176e3a]">neil@journey:~$</span> cat
            journey/manifesto.txt<span className="inline-block w-[10px] h-[18px] bg-[#33ff66] align-middle animate-pulse ml-1" />
          </p>
          <p className="mt-4 text-base sm:text-xl leading-relaxed">
            A computer science journey in the medium it was written in.
            <br />
            Chapters type themselves. Real subjects. Real work. Zero shortcuts.
            <br />
            <span className="text-[#176e3a]">Scroll to advance — or type below.</span>
          </p>
        </div>

        {/* chapters */}
        <div className="pb-10">
          {CHAPTERS.map((c) => (
            <ChapterBlock key={c.id} chapter={c} />
          ))}
        </div>

        {/* live dialogue */}
        <div className="sticky bottom-0 bg-[#020805]/95 backdrop-blur border-t border-[#176e3a] py-4">
          {history.map((line, i) => (
            <p
              key={i}
              className={
                line.startsWith("$")
                  ? "text-[#33ff66]"
                  : "text-[#176e3a] whitespace-pre-wrap"
              }
            >
              {line}
            </p>
          ))}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              runCommand(input);
            }}
            className="flex items-center gap-2 mt-1"
          >
            <label htmlFor="cli" className="text-[#176e3a] shrink-0">
              neil@journey:~$
            </label>
            <input
              id="cli"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              placeholder="type 'help' — try 'goto ojt-era'"
              className="flex-1 bg-transparent outline-none text-[#33ff66] placeholder:text-[#0f3d1f]"
            />
          </form>
          <div ref={bottomRef} />
        </div>
      </div>
    </main>
  );
}
