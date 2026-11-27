"use client";

import { Canvas } from "@react-three/fiber";
import { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/** Soft round sprite for points — points render square without a map. */
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
    const t = new THREE.CanvasTexture(c);
    t.needsUpdate = true;
    return t;
  }, [color]);
}

/** Stars: a fixed random field, far away, two depth shells. */
function StarField() {
  const ref = useRef<THREE.Points>(null);
  const sprite = useStarTexture("#cfe4ff");
  const positions = new Float32Array(1200 * 3);
  let seed = 42;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i < 1200; i++) {
    positions[i * 3] = (rand() - 0.5) * 400;
    positions[i * 3 + 1] = (rand() - 0.5) * 400;
    positions[i * 3 + 2] = (rand() - 0.5) * 400 - 100;
  }
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.004;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial map={sprite} alphaTest={0.01} size={1.4} color="#cfe4ff" sizeAttenuation transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

/** The black hole: glowing accretion rings + the shadow, tilted in 3D. */
function BlackHole({ activeRing }: { activeRing: number }) {
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const narrow = viewport.aspect < 1;
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.z += delta * 0.12;
    // subtle breathing of the disk glow
    const s = 1 + Math.sin(state.clock.elapsedTime * 1.4) * 0.012;
    group.current.scale.setScalar(s);
  });
  const rings = [
    { r: 14, tube: 1.9, color: "#4a79bb", opacity: 0.4 },
    { r: 11, tube: 1.5, color: "#7aa0d6", opacity: 0.55 },
    { r: 8, tube: 1.2, color: "#e6f1ff", opacity: 0.8 },
    { r: 5.6, tube: 1.0, color: "#ffc857", opacity: 0.9 },
  ];
  return (
    <group
      ref={group}
      rotation={[1.15, 0, 0.35]}
      position={[narrow ? 26 : 16, narrow ? 6 : 0, -20]}
    >
      {rings.map((ring, i) => (
        <mesh key={i}>
          <torusGeometry args={[ring.r, ring.tube, 2, 96]} />
          <meshBasicMaterial
            color={ring.color}
            transparent
            opacity={i === activeRing ? Math.min(ring.opacity + 0.3, 1) : ring.opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
      {/* the shadow — light does not escape */}
      <mesh>
        <sphereGeometry args={[3.6, 48, 48]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      {/* photon glow */}
      <mesh>
        <sphereGeometry args={[4.4, 32, 32]} />
        <meshBasicMaterial color="#ffc857" transparent opacity={0.16} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

/** Camera falls inward with scroll progress. */
function FallCamera({ progress }: { progress: number }) {
  const { camera } = useThree();
  useFrame(() => {
    const targetZ = 90 - progress * 62; // 90 → 28
    const targetX = 10 - progress * 18; // drift left as we fall
    camera.position.x += (targetX - camera.position.x) * 0.06;
    camera.position.z += (targetZ - camera.position.z) * 0.06;
    camera.lookAt(8, 0, -20);
  });
  return null;
}

function Scene({ progress, activeRing }: { progress: number; activeRing: number }) {
  return (
    <>
      <FallCamera progress={progress} />
      <ambientLight intensity={0.4} />
      <StarField />
      <BlackHole activeRing={activeRing} />
      <fog attach="fog" args={["#07070a", 60, 220]} />
    </>
  );
}

export default function DeepHome() {
  const [progress, setProgress] = useState(0);
  const [activeRing, setActiveRing] = useState(0);
  const [webgl, setWebgl] = useState(true);
  const [active, setActive] = useState<string>("intro");

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      setWebgl(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setWebgl(false);
    }
  }, []);

  useEffect(() => {
    const sections = ["intro", "first-year", "second-year", "third-year", "ojt-era", "reflection"];
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
      let current = "intro";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.55) current = id;
      }
      setActive(current);
      setActiveRing(Math.max(0, sections.indexOf(current) - 1));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const DEPTH_AU = (progress * 3.2).toFixed(2);
  const RING_LABEL = ["", "1ST YEAR", "2ND YEAR", "3RD YEAR", "OJT"];
  const ringName = RING_LABEL[activeRing] ?? "1ST YEAR";

  return (
    <main className="min-h-screen bg-[#07070a] text-[#e6f1ff] selection:bg-[#ffc857] selection:text-[#07070a]">
      {/* 3D layer */}
      <div className="fixed inset-0 z-0">
        {webgl ? (
          <Canvas camera={{ position: [10, 2, 90], fov: 55 }} dpr={[1, 1.75]}>
            <Suspense fallback={null}>
              <Scene progress={progress} activeRing={activeRing} />
            </Suspense>
          </Canvas>
        ) : (
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_70%_50%,#1a2a4a_0%,#07070a_65%)]" />
        )}
      </div>
      <div aria-hidden className="fixed inset-0 z-[1] pointer-events-none opacity-[0.05]"
        style={{ background: "radial-gradient(circle at 80% 20%, #4a79bb 0%, transparent 45%)" }} />

      {/* content */}
      <div className="relative z-10">
        <header className="flex flex-wrap items-baseline justify-between gap-3 px-5 sm:px-10 py-6">
          <p className="tracking-[0.5em] text-sm">
            NEIL JUSTIN MALLARI
            <span className="block text-[10px] tracking-[0.34em] text-[#4a79bb] mt-1">
              A JOURNEY PAST THE POINT OF NO RETURN — IN TRUE 3D
            </span>
          </p>
          <nav className="flex gap-5 text-[11px] tracking-[0.25em] text-[#8fa8c0]">
            <a className="hover:text-[#ffc857]" href="#intro">HOME</a>
            <a className="hover:text-[#ffc857]" href="#first-year">POSTS</a>
            <a className="hover:text-[#ffc857]" href="#about">ABOUT</a>
            <a className="hover:text-[#ffc857]" href="#contact">CONTACT</a>
          </nav>
        </header>

        <div className="mx-auto max-w-2xl sm:px-10 px-5 pb-40 lg:mx-0 lg:ml-[6vw]">
          <section className="pt-[38vh]" id="intro">
            <p className="text-[11px] tracking-[0.4em] text-[#4a79bb]">OBSERVE THE RECORD</p>
            <h1 className="mt-6 text-4xl sm:text-6xl font-extralight leading-tight drop-shadow-[0_2px_18px_rgba(7,7,10,0.9)]">
              Four years in orbit.
              <br />
              OJT: <span className="font-semibold text-[#ffc857]">no return.</span>
            </h1>
            <p className="mt-6 text-sm sm:text-lg text-[#c8d6e5] leading-relaxed font-light max-w-lg drop-shadow-[0_2px_12px_rgba(7,7,10,1)]">
              The camera is already caught in the gravity. Every chapter you pass,
              it falls deeper — the disk brightens, the horizon approaches.
            </p>
          </section>

          {[
            { id: "first-year", ring: 0, label: "1ST YEAR", color: "#4a79bb",
              blurb: "The outermost orbit. Foundations: CC 101, CC 102, DS 101, PL 101 — every later year assumed I spoke this language.",
              entries: ["CC 101 · Introduction to Computing", "CC 102 · Computer Programming 1", "DS 101 · Discrete Structure 1", "PL 101 · Programming Languages"] },
            { id: "second-year", ring: 1, label: "2ND YEAR", color: "#5f92cc",
              blurb: "Orbit tightens. Data structures, OOP, first security classes — velocity increasing, interviews beginning to make sense.",
              entries: ["CC 104 · Data Structures and Algorithms", "SDF 104 · Object-Oriented Programming", "IAS 101 · Information Assurance 1", "AL 101 · Algorithms and Complexity", "AL 102 · Automata Theory"] },
            { id: "third-year", ring: 2, label: "3RD YEAR", color: "#e6f1ff",
              blurb: "Inner system. Operating systems, HCI, networks, distributed computing — the heaviest matter: real systems thinking, real trade-offs.",
              entries: ["OS 101 · Operating Systems", "AR 101 · Architecture and Organization", "HCI 101 · Human-Computer Interaction 1", "NC 101 · Networks and Communications", "PD 101 · Parallel and Distributed Computing"] },
            { id: "ojt-era", ring: 3, label: "OJT", color: "#ff3e1f",
              blurb: "The crossing. Beyond this ring there is no return to 'student only' — Career Team, then Thorne: real platforms, real users, real interviews.",
              entries: ["Career Team LLC · Software Engineer", "Thorne Consulting · Interim Lead Engineer"] },
          ].map((o) => (
            <section key={o.id} id={o.id} className="pt-[70vh] scroll-mt-10">
              <div className={`border p-6 sm:p-8 backdrop-blur-md transition-colors duration-700 ${
                active === o.id ? "border-[#ffc857]/60" : "border-[#223247]"
              } bg-[#07070a]/80`}>
                <p className="text-[10px] tracking-[0.4em]" style={{ color: o.color }}>
                  {active === o.id ? "● NOW ORBITING" : "RING"} — {o.label}
                </p>
                <p className="mt-4 text-sm sm:text-base text-[#c8d6e5] leading-relaxed font-light">{o.blurb}</p>
                <ul className="mt-5 space-y-2">
                  {o.entries.map((entry) => (
                    <li key={entry} className="text-[13px] text-[#8fa8c0] flex items-baseline gap-3">
                      <span className="text-[#ffc857]">◦</span>{entry}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-[11px] tracking-[0.25em] text-[#4a79bb]">READ THE CHAPTER →</p>
              </div>
            </section>
          ))}

          <section id="reflection" className="pt-[70vh] scroll-mt-10">
            <div className={`border p-6 sm:p-8 backdrop-blur-md transition-colors duration-700 ${
              active === "reflection" ? "border-[#ffc857]" : "border-[#223247]"
            } bg-[#07070a]/85`}>
              <p className="text-[10px] tracking-[0.4em] text-[#ffc857]">● EVENT HORIZON — FINAL REFLECTION</p>
              <h2 className="mt-4 text-2xl sm:text-3xl font-extralight leading-snug">
                Past this ring, nothing escapes unchanged.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#c8d6e5] font-light leading-relaxed">
                The final reflection — what four years of orbits and one era of real
                work actually taught. Written from the other side.
              </p>
            </div>
            <div id="about" className="scroll-mt-10" />
            <div id="contact" className="scroll-mt-10" />
            <p className="mt-16 text-center text-[10px] tracking-[0.34em] text-[#223247]">— SINGULARITY —</p>
          </section>
        </div>
      </div>

      {/* depth gauge */}
      <div className="fixed bottom-5 left-5 z-10 border border-[#223247] bg-[#07070a]/80 px-4 py-2 text-[10px] tracking-[0.3em] text-[#8fa8c0]">
        DEPTH {DEPTH_AU} AU — <span className="text-[#ffc857]">NOW ORBITING: {active === "reflection" ? "HORIZON" : ringName}</span>
      </div>
    </main>
  );
}
