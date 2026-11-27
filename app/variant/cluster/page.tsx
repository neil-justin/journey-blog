"use client";

import { Canvas } from "@react-three/fiber";
import { useRef, useState, useEffect, useMemo, Suspense } from "react";import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/** Deterministic PRNG so the sky is the same every visit. */
function mulberry32(a: number) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type ClusterDef = {
  id: string;
  label: string;
  center: [number, number, number];
  color: string;
  count: number;
  spread: number;
};

const CLUSTERS: ClusterDef[] = [
  { id: "first-year", label: "1ST YEAR — FOUNDATIONS", center: [0, 0, 0], color: "#9ecfff", count: 34, spread: 9 },
  { id: "second-year", label: "2ND YEAR — STRUCTURE", center: [26, 6, -40], color: "#7fb8ff", count: 42, spread: 10 },
  { id: "third-year", label: "3RD YEAR — SYSTEMS", center: [54, -4, -85], color: "#e6f1ff", count: 48, spread: 11 },
  { id: "ojt-era", label: "OJT — THE CROSSING", center: [84, 10, -135], color: "#ffc857", count: 18, spread: 7 },
  { id: "reflection", label: "REFLECTION — LEAVING", center: [116, 22, -190], color: "#9ece6a", count: 8, spread: 5 },
];

function Stars({ cluster, isActive }: { cluster: ClusterDef; isActive: boolean }) {
  const group = useRef<THREE.Group>(null);
  const [positions, lineVerts] = useMemo(() => {
    const rand = mulberry32(cluster.id.length * 1337 + cluster.center[0]);
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < cluster.count; i++) {
      pts.push(new THREE.Vector3(
        cluster.center[0] + (rand() - 0.5) * 2 * cluster.spread,
        cluster.center[1] + (rand() - 0.5) * 2 * cluster.spread,
        cluster.center[2] + (rand() - 0.5) * 2 * cluster.spread
      ));
    }
    // constellation: connect a few nearby stars INSIDE the cluster volume only
    const verts: number[] = [];
    for (let i = 0; i < Math.min(4, pts.length - 1); i += 2) {
      verts.push(pts[i].x, pts[i].y, pts[i].z, pts[i + 1].x, pts[i + 1].y, pts[i + 1].z);
    }
    const pos = new Float32Array(pts.flatMap((p) => [p.x, p.y, p.z]));
    const sizes = new Float32Array(pts.map((_, i) => 0.6 + (i % 5) * 0.35));
    return [pos, new Float32Array(verts)];
  }, [cluster]);
  const sprite = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, cluster.color);
    g.addColorStop(0.35, cluster.color + "cc");
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }, [cluster.color]);

  useFrame((state) => {
    if (group.current) {
      group.current.position.y = cluster.center[1] + Math.sin(state.clock.elapsedTime * 0.6 + cluster.center[0]) * 0.6;
    }
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={sprite}
          alphaTest={0.01}
          size={isActive ? 2.2 : 1.3}
          color={cluster.color}
          transparent
          opacity={isActive ? 1 : 0.5}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      {/* constellation lines inside the cluster */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[lineVerts, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color={cluster.color}
          transparent
          opacity={isActive ? 0.5 : 0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
      {/* nebula haze: one large soft sprite behind the cluster */}
      <mesh position={[cluster.center[0], cluster.center[1], cluster.center[2] - 14]}>
        <sphereGeometry args={[cluster.spread * 2.6, 24, 24]} />
        <meshBasicMaterial
          color={cluster.color}
          transparent
          opacity={isActive ? 0.07 : 0.03}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/** The OJT comet: leaves the system on the final section. */
function Comet({ leaving }: { leaving: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = leaving
      ? Math.min((state.clock.elapsedTime % 8) * 0.6 + 4, 10)
      : Math.max(0, 2 - (state.clock.elapsedTime % 8) * 0.3);
    ref.current.position.set(84 + t * 2.4, 22 + t * 0.9, -135 - t * 4);
  });
  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[1.1, 24, 24]} />
        <meshBasicMaterial color="#9ece6a" />
      </mesh>
      <mesh rotation={[0, 0, -0.4]}>
        <coneGeometry args={[0.8, 7, 16]} />
        <meshBasicMaterial color="#9ece6a" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

/** Camera travels cluster to cluster with scroll. */
function TravelCamera({ progress }: { progress: number }) {
  const { camera } = useThree();
  useFrame(() => {
    const i = Math.min(Math.floor(progress * CLUSTERS.length), CLUSTERS.length - 1);
    const c = CLUSTERS[i];
    const target = new THREE.Vector3(c.center[0] - 8, c.center[1] + 2, c.center[2] + 26);
    camera.position.lerp(target, 0.05);
    camera.lookAt(c.center[0], c.center[1], c.center[2] - 10);
  });
  return null;
}

function Scene({ progress, activeIndex }: { progress: number; activeIndex: number }) {
  return (
    <>
      <TravelCamera progress={progress} />
      <ambientLight intensity={0.5} />
      {CLUSTERS.map((c, i) => (
        <Stars key={c.id} cluster={c} isActive={i === activeIndex} />
      ))}
      <Comet leaving={activeIndex >= 3} />
      <fog attach="fog" args={["#030308", 70, 260]} />
    </>
  );
}

const SECTION_IDS = ["intro", "first-year", "second-year", "third-year", "ojt-era", "reflection"];

export default function ClusterHome() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("intro");
  const [webgl, setWebgl] = useState(true);

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
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeIndex = Math.max(0, SECTION_IDS.indexOf(active) - 1);
  const current = CLUSTERS[Math.min(activeIndex, CLUSTERS.length - 1)];

  return (
    <main className="min-h-screen bg-[#030308] text-[#dfe8f5] selection:bg-[#ffc857] selection:text-[#030308]">
      <div className="fixed inset-0 z-0">
        {webgl ? (
          <Canvas camera={{ position: [-10, 3, 30], fov: 58 }} dpr={[1, 1.75]}>
            <Suspense fallback={null}>
              <Scene progress={progress} activeIndex={activeIndex} />
            </Suspense>
          </Canvas>
        ) : (
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_40%_40%,#1a1f3a_0%,#030308_70%)]" />
        )}
      </div>

      <div className="relative z-10">
        <header className="flex flex-wrap items-baseline justify-between gap-3 px-5 sm:px-10 py-6">
          <p className="tracking-[0.5em] text-sm">
            NEIL JUSTIN MALLARI
            <span className="block text-[10px] tracking-[0.34em] text-[#7fb8ff] mt-1">
              THE CURRICULUM, MAPPED AS SKY
            </span>
          </p>
          <nav className="flex gap-5 text-[11px] tracking-[0.25em] text-[#9aa7c4]">
            <a className="hover:text-[#ffc857]" href="#intro">HOME</a>
            <a className="hover:text-[#ffc857]" href="#first-year">POSTS</a>
            <a className="hover:text-[#ffc857]" href="#about">ABOUT</a>
            <a className="hover:text-[#ffc857]" href="#contact">CONTACT</a>
          </nav>
        </header>

        <div className="mx-auto max-w-2xl sm:px-10 px-5 pb-40 lg:mx-0 lg:ml-[6vw]">
          <section className="pt-[36vh]" id="intro">
            <p className="text-[11px] tracking-[0.4em] text-[#7fb8ff]">CHART THE SKY</p>
            <h1 className="mt-6 text-4xl sm:text-6xl font-extralight leading-tight drop-shadow-[0_2px_18px_rgba(3,3,8,0.95)]">
              Every subject,<br />a <span className="text-[#ffc857] font-medium">star.</span>
            </h1>
            <p className="mt-6 text-sm sm:text-lg text-[#c8d6e5] leading-relaxed font-light max-w-lg drop-shadow-[0_2px_12px_rgba(3,3,8,1)]">
              Four clusters of a computer science journey, mapped in three dimensions.
              The camera travels light-year by light-year — the OJT comet leaves the system last.
            </p>
          </section>

          {CLUSTERS.map((c, i) => (
            <section
              key={c.id}
              id={c.id}
              className="pt-[68vh] scroll-mt-10"
            >
              <div className={`border p-6 sm:p-8 backdrop-blur-md transition-colors duration-700 ${
                active === c.id ? "border-[#ffc857]/60" : "border-[#223247]"
              } bg-[#030308]/80`}>
                <p className="text-[10px] tracking-[0.4em]" style={{ color: c.color }}>
                  {active === c.id ? "● NOW CHARTING" : "CLUSTER"} — {c.label}
                </p>
                <p className="mt-3 text-[11px] tracking-[0.25em] text-[#9aa7c4]">
                  {c.count} STARS · LIGHT-YEARS OUT: {i + 1}
                </p>
                {i < 3 && (
                  <ul className="mt-5 space-y-2">
                    {(i === 0
                      ? ["CC 101 · Introduction to Computing", "CC 102 · Computer Programming 1", "DS 101 · Discrete Structure 1", "PL 101 · Programming Languages"]
                      : i === 1
                      ? ["CC 104 · Data Structures and Algorithms", "SDF 104 · Object-Oriented Programming", "IAS 101 · Information Assurance 1", "AL 102 · Automata Theory"]
                      : ["OS 101 · Operating Systems", "HCI 101 · Human-Computer Interaction 1", "NC 101 · Networks and Communications", "PD 101 · Parallel and Distributed Computing"]
                    ).map((s) => (
                      <li key={s} className="text-[13px] text-[#9aa7c4] flex items-baseline gap-3">
                        <span className="text-[#ffc857]">✦</span>{s}
                      </li>
                    ))}
                  </ul>
                )}
                {i === 3 && (
                  <p className="mt-4 text-sm text-[#c8d6e5] font-light leading-relaxed">
                    Career Team LLC · Software Engineer — Thorne Consulting · Interim Lead.
                    Real platforms, real users, real interviews. Three chapters of shipped work.
                  </p>
                )}
                {i === 4 && (
                  <p className="mt-4 text-sm text-[#c8d6e5] font-light leading-relaxed">
                    The final reflection — written from outside the system, looking back at the sky.
                  </p>
                )}
                <p className="mt-6 text-[11px] tracking-[0.25em] text-[#7fb8ff]">READ THE CHAPTER →</p>
              </div>
            </section>
          ))}

          <div id="about" className="scroll-mt-10" />
          <div id="contact" className="scroll-mt-10" />
          <p className="mt-16 text-center text-[10px] tracking-[0.34em] text-[#223247]">
            — TRAVELING LIGHT —
          </p>
        </div>
      </div>

      <div className="fixed bottom-5 left-5 z-10 border border-[#223247] bg-[#030308]/80 px-4 py-2 text-[10px] tracking-[0.3em] text-[#9aa7c4]">
        CHARTING: <span className="text-[#ffc857]">{current.label}</span>
      </div>
    </main>
  );
}
