"use client";

import { useState } from "react";

const EMAIL = "neiljustin.mallari@proton.me";

const LINKS = [
  {
    href: `mailto:${EMAIL}`,
    label: EMAIL,
    hint: "EMAIL",
  },
  {
    href: "https://github.com/neil-justin",
    label: "github.com/neil-justin",
    hint: "GITHUB",
  },
  {
    href: "https://www.linkedin.com/in/neil-mallari/",
    label: "linkedin.com/in/neil-mallari",
    hint: "LINKEDIN",
  },
];

export default function ContactLinks() {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    await navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <ul className="mt-10 space-y-4">
      {LINKS.map((l) => (
        <li key={l.hint} className="border border-[#223247] bg-[#07070a]/80 p-5">
          <p className="text-[10px] font-mono tracking-[0.4em] text-[#4a79bb]">
            {l.hint}
          </p>
          <a
            href={l.href}
            className="mt-2 block text-sm text-[#e6f1ff] hover:text-[#ffc857]"
          >
            {l.label}
          </a>
          {l.hint === "EMAIL" && (
            <button
              onClick={copyEmail}
              className="mt-3 text-[10px] font-mono tracking-[0.3em] text-[#8fa8c0] hover:text-[#ffc857]"
            >
              {copied ? "COPIED ✓" : "COPY ADDRESS"}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
