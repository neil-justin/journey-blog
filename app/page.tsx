import Link from "next/link";

const variants = [
  {
    href: "/variant/deep",
    name: "The Horizon, Rendered Deep",
    thesis:
      "3D black hole with lensing, camera falls through true z-depth per chapter. Evolves the world you picked.",
  },
  {
    href: "/variant/cluster",
    name: "The Star Cluster",
    thesis:
      "Curriculum as navigable 3D galaxy — subjects as stars clustered by year, OJT a comet leaving the system.",
  },
];

export default function Home() {
  return (
    <main className="flex-1 flex items-center justify-center bg-[#030308] text-[#dfe8f5] px-6">
      <div className="w-full max-w-xl">
        <p className="text-xs tracking-[0.3em] uppercase text-[#9aa7c4]">
          3D world test — pick one
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-wide">Neil Justin Mallari — Journey Blog</h1>
        <ul className="mt-8 space-y-4">
          {variants.map((v) => (
            <li key={v.href}>
              <Link
                href={v.href}
                className="block border border-[#223247] rounded-lg p-5 hover:border-[#ffc857] transition-colors"
              >
                <span className="font-bold">{v.name}</span>
                <span className="block mt-1 text-sm text-[#9aa7c4]">{v.thesis}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-xs text-[#9aa7c4]">
          The current 2D horizon build stays at git history; the winner becomes the
          site. Both need WebGL — there are static fallbacks.
        </p>
      </div>
    </main>
  );
}
