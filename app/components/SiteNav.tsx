const LINKS = [
  { href: "/", label: "HOME" },
  { href: "/posts", label: "POSTS" },
  { href: "/about", label: "ABOUT" },
  { href: "/contact", label: "CONTACT" },
];

export default function SiteNav() {
  return (
    <nav className="flex gap-5 text-[11px] tracking-[0.25em] text-[#8fa8c0] font-mono">
      {LINKS.map((l) => (
        <a key={l.href} className="hover:text-[#ffc857]" href={l.href}>
          {l.label}
        </a>
      ))}
    </nav>
  );
}
