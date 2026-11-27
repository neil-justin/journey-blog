/**
 * Generates per-post header art (SVG) for content/posts/*.
 * Deterministic (seeded PRNG) — same slugs always produce same art.
 * Run: node scripts/generate-post-art.mjs
 */
import { mkdirSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const OUT_DIR = path.join(process.cwd(), "public", "posts", "art");

const PHASE_ART = {
  "1st-year": { accent: "#4a79bb", rings: 1, horizon: 0.0 },
  "2nd-year": { accent: "#5f92cc", rings: 2, horizon: 0.0 },
  "3rd-year": { accent: "#e6f1ff", rings: 3, horizon: 0.0 },
  ojt: { accent: "#ff3e1f", rings: 3, horizon: 0.0, streak: true },
  "4th-year": { accent: "#ffc857", rings: 3, horizon: 0.55 },
  reflection: { accent: "#ffc857", rings: 4, horizon: 0.9 },
};

function mulberry32(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function slugSeed(slug) {
  let h = 2166136261;
  for (const c of slug) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}

function generate(slug, phase, variant = 0) {
  const { accent, rings, horizon, streak = false } = PHASE_ART[phase];
  const rand = mulberry32(slugSeed(slug) + variant * 7919);
  const W = 1200, H = 600;
  // the gravity well sits off to the right, like the homepage world
  const cx = W * 0.72, cy = H * 0.5;

  // starfield
  let stars = "";
  for (let i = 0; i < 150; i++) {
    const x = rand() * W, y = rand() * H;
    const r = rand() * 1.1 + 0.2;
    const o = 0.15 + rand() * 0.6;
    stars += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" fill="#e6f1ff" opacity="${o.toFixed(2)}"/>`;
  }

  // orbital rings, tightening toward the well
  let ringSvg = "";
  const baseR = 90;
  for (let i = 0; i < rings; i++) {
    const rx = baseR + i * (52 + rand() * 26);
    const ry = rx * (0.30 + rand() * 0.08);
    const rot = -14 + rand() * 10;
    const op = 0.5 - i * 0.11;
    ringSvg += `<ellipse cx="${cx}" cy="${cy}" rx="${rx.toFixed(0)}" ry="${ry.toFixed(0)}" fill="none" stroke="${accent}" stroke-width="1" opacity="${Math.max(op, 0.12).toFixed(2)}" transform="rotate(${rot.toFixed(1)} ${cx} ${cy})"/>`;
  }

  // the well itself: glowing core growing toward an event horizon
  const coreR = 16 + horizon * 150;
  const glow = `<circle cx="${cx}" cy="${cy}" r="${coreR.toFixed(0)}" fill="url(#well)"/>
    <circle cx="${cx}" cy="${cy}" r="${(coreR * 0.42).toFixed(0)}" fill="#07070a"/>
    <circle cx="${cx}" cy="${cy}" r="${(coreR * 0.42).toFixed(0)}" fill="none" stroke="${accent}" stroke-width="1.5" opacity="0.9"/>`;

  // OJT era: an infall streak crossing toward the well
  let streakSvg = "";
  if (streak) {
    const sx = W * 0.06, sy = H * 0.78;
    streakSvg = `<path d="M ${sx} ${sy} Q ${W * 0.4} ${H * 0.62} ${cx - coreR * 0.6} ${cy + 4}" fill="none" stroke="${accent}" stroke-width="2" opacity="0.85"/>
      <path d="M ${sx} ${sy} Q ${W * 0.4} ${H * 0.62} ${cx - coreR * 0.6} ${cy + 4}" fill="none" stroke="${accent}" stroke-width="6" opacity="0.12"/>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Journey post art">
  <defs>
    <radialGradient id="well" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.55"/>
      <stop offset="55%" stop-color="${accent}" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#07070a"/>
  ${stars}
  ${ringSvg}
  ${glow}
  ${streakSvg}
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" fill="none" stroke="#223247"/>
</svg>
`;
  writeFileSync(path.join(OUT_DIR, `${slug}.svg`), svg);
}

// ojt posts get slightly different streak variants
const OJT_VARIANT = {
  "first-job-career-team": 0,
  "interim-lead-thorne": 1,
  "lessons-from-shipping": 2,
};

mkdirSync(OUT_DIR, { recursive: true });
const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));
for (const file of files) {
  const slug = file.replace(/\.mdx$/, "");
  const raw = await import("node:fs/promises").then((fs) => fs.readFile(path.join(POSTS_DIR, file), "utf8"));
  const m = raw.match(/^---\n([\s\S]*?)\n---/);
  const phase = m && m[1].match(/^phase:\s*(\S+)/m)?.[1];
  if (!PHASE_ART[phase]) throw new Error(`no art config for phase "${phase}" (${slug})`);
  generate(slug, phase, OJT_VARIANT[slug] ?? 0);
  console.log("wrote", slug);
}
