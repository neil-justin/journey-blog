"use client";

import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ---------------- textures (generated, no assets needed) ---------------- */

function useStarTexture(color = "#ffffff") {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, color);
    g.addColorStop(0.35, color + "cc");
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }, [color]);
}

/** Accretion disk texture: hot white-gold inner edge cooling to blue outer bands. */
function useDiskTexture() {
  return useMemo(() => {
    const size = 1024;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d")!;
    const cx = size / 2;
    // radial bands with noise — hot near center, cool at edge
    let seed = 7;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < 340; i++) {
      const t = rand(); // 0 = inner, 1 = outer
      const r = 90 + t * (size / 2 - 100);
      const bandWidth = 6 + rand() * 22;
      const hot = 1 - t;
      const col = `rgba(${Math.round(200 + 55 * hot)},${Math.round(
        150 + 80 * hot
      )},${Math.round(90 + 165 * (1 - hot))},${(0.10 + rand() * 0.35) * (0.35 + 0.65 * hot)})`;
      ctx.beginPath();
      ctx.strokeStyle = col;
      ctx.lineWidth = bandWidth;
      // slightly wobbly arc per band
      const a0 = rand() * Math.PI * 2;
      const a1 = a0 + (1 + rand() * 3) * (Math.PI / 3);
      ctx.arc(cx, cx, r, a0, a1);
      ctx.stroke();
    }
    const t = new THREE.CanvasTexture(c);
    t.needsUpdate = true;
    return t;
  }, []);
}

/* ---------------- scene pieces ---------------- */

function StarField() {
  const ref = useRef<THREE.Points>(null);
  const sprite = useStarTexture("#cfe4ff");
  const positions = useMemo(() => {
    let seed = 42;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    const p = new Float32Array(1200 * 3);
    for (let i = 0; i < 1200; i++) {
      p[i * 3] = (rand() - 0.5) * 400;
      p[i * 3 + 1] = (rand() - 0.5) * 400;
      p[i * 3 + 2] = (rand() - 0.5) * 400 - 100;
    }
    return p;
  }, []);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.004;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={sprite}
        alphaTest={0.01}
        size={1.3}
        color="#cfe4ff"
        sizeAttenuation
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

const RING_INFO = [
  { r: 15.5, color: "#4a79bb", opacity: 0.32 }, // 1st year — outer
  { r: 12.5, color: "#5f92cc", opacity: 0.4 },
  { r: 9.5, color: "#e6f1ff", opacity: 0.5 },
  { r: 6.8, color: "#ff3e1f", opacity: 0.55 }, // OJT — the red ring
  { r: 4.6, color: "#ffc857", opacity: 0.7 }, // 4th year — inner, now
];

function BlackHole({ activeRing }: { activeRing: number }) {
  const disk = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const diskTexture = useDiskTexture();
  const glow = useStarTexture("#ffc857");
  const narrow = viewport.aspect < 1;

  useFrame((state, delta) => {
    if (disk.current) disk.current.rotation.z -= delta * 0.22;
    if (group.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 1.3) * 0.008;
      group.current.scale.setScalar(s * (narrow ? 0.62 : 1));
    }
  });

  return (
    <group ref={group} position={[narrow ? 0 : 18, narrow ? 9 : 1, -20]}>
      <group rotation={[1.22, 0, 0.3]}>
        {/* the accretion disk — one textured ring, reads as light not plastic */}
        <mesh ref={disk}>
          <ringGeometry args={[3.8, 16.5, 128]} />
          <meshBasicMaterial
            map={diskTexture}
            transparent
            opacity={0.95}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* orbit guides = chapter rings */}
        {RING_INFO.map((ring, i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[ring.r, 0.09, 8, 128]} />
            <meshBasicMaterial
              color={ring.color}
              transparent
              opacity={i === activeRing ? 0.95 : ring.opacity * 0.5}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
      {/* the shadow — light does not escape */}
      <mesh>
        <sphereGeometry args={[3.4, 48, 48]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      {/* photon glow just outside the shadow */}
      <sprite scale={[13, 13, 1]}>
        <spriteMaterial
          map={glow}
          color="#ffc857"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
    </group>
  );
}

function FallCamera({ progress }: { progress: number }) {
  const { camera } = useThree();
  const { viewport } = useThree();
  useFrame(() => {
    const targetZ = 78 - progress * 50; // 78 → 28
    camera.position.z += (targetZ - camera.position.z) * 0.06;
    camera.position.y += (2 - camera.position.y) * 0.06;
    // desktop: hole sits in the right half; mobile: centered above text
    camera.lookAt(viewport.aspect < 1 ? 0 : 7, 1, -20);
  });
  return null;
}

function Scene({ progress, activeRing }: { progress: number; activeRing: number }) {
  return (
    <>
      <FallCamera progress={progress} />
      <StarField />
      <BlackHole activeRing={activeRing} />
      <EffectComposer>
        <Bloom intensity={1.1} luminanceThreshold={0.15} mipmapBlur radius={0.7} />
      </EffectComposer>
    </>
  );
}

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

export default function DeepHome() {
  const [progress, setProgress] = useState(0);
  const [activeRing, setActiveRing] = useState(0);
  const [webgl, setWebgl] = useState(true);
  const [active, setActive] = useState("intro");

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      setWebgl(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setWebgl(false);
    }
  }, []);

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
      <div className="fixed inset-0 z-0">
        {webgl ? (
          <Canvas camera={{ position: [0, 2, 78], fov: 55 }} dpr={[1, 1.75]}>
            <Suspense fallback={null}>
              <Scene progress={progress} activeRing={activeRing} />
            </Suspense>
          </Canvas>
        ) : (
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_50%_45%,#1a2a4a_0%,#07070a_65%)]" />
        )}
      </div>

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
        <header className="flex flex-wrap items-baseline justify-between gap-3 px-5 sm:px-10 py-6">
          <p className="font-mono tracking-[0.5em] text-sm">
            NEIL JUSTIN MALLARI
            <span className="block text-[10px] tracking-[0.34em] text-[#4a79bb] mt-1">
              MY JOURNEY FROM 1ST YEAR TO OJT — IN 3D
            </span>
          </p>
          <nav className="flex gap-5 text-[11px] tracking-[0.25em] text-[#8fa8c0] font-mono">
            <a className="hover:text-[#ffc857]" href="/">HOME</a>
            <a className="hover:text-[#ffc857]" href="/posts">POSTS</a>
            <a className="hover:text-[#ffc857]" href="/about">ABOUT</a>
            <a className="hover:text-[#ffc857]" href="/contact">CONTACT</a>
          </nav>
        </header>

        <div className="mx-auto max-w-2xl sm:px-10 px-5 pb-40 lg:mx-0 lg:ml-[6vw]">
          <section className="pt-[42vh]" id="intro">
            <p className="text-[11px] font-mono tracking-[0.4em] text-[#4a79bb] drop-shadow-[0_2px_8px_rgba(7,7,10,1)]">
              MY JOURNEY AS A CS STUDENT
            </p>
            <h1 className="mt-6 text-3xl sm:text-5xl leading-snug font-bold font-display drop-shadow-[0_2px_18px_rgba(7,7,10,0.95)]">
              From 1st year
              <br />
              to <span className="text-[#ffc857]">OJT and beyond.</span>
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
            <div className="scroll-mt-10" />
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
