import Link from "next/link";

const variants = [
  {
    href: "/variant/terminal",
    name: "The Midnight Terminal",
    thesis:
      "The blog as one living terminal session — chapters type themselves on scroll, search is typing into the dialogue.",
  },
  {
    href: "/variant/horizon",
    name: "The Event Horizon",
    thesis:
      "The journey as orbits around a black hole — year levels as matter rings, OJT the crossing. Most spectacular.",
  },
];

export default function Home() {
  return (
    <main className="flex-1 flex items-center justify-center bg-[#0b0d10] text-[#e6edf3] px-6">
      <div className="w-full max-w-xl">
        <p className="text-xs tracking-[0.3em] uppercase text-[#8b949e]">
          World test build — pick the visual world
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-wide">
          Neil Justin Mallari — Journey Blog
        </h1>
        <ul className="mt-8 space-y-4">
          {variants.map((v) => (
            <li key={v.href}>
              <Link
                href={v.href}
                className="block border border-[#30363d] rounded-lg p-5 hover:border-[#3fb950] transition-colors"
              >
                <span className="font-bold">{v.name}</span>
                <span className="block mt-1 text-sm text-[#8b949e]">
                  {v.thesis}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-xs text-[#8b949e]">
          Both variants are real builds of the same content structure. The
          chosen world becomes the site; the other is deleted.
        </p>
      </div>
    </main>
  );
}
