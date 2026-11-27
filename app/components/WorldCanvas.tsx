"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useRef, useEffect, useMemo, useState, Suspense } from "react";
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
  const diskTexture = useDiskTexture();
  const glow = useStarTexture("#ffc857");

  useFrame((state, delta) => {
    if (disk.current) disk.current.rotation.z -= delta * 0.22;
    if (group.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 1.3) * 0.008;
      group.current.scale.setScalar(s);

      // dynamically center the hole in the right half of the screen (75% width)
      // at any window size/aspect ratio, and keep it there while scrolling
      const cam = state.camera as THREE.PerspectiveCamera;
      const dist = cam.position.z - group.current.position.z;
      const viewH = 2 * dist * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
      const viewW = viewH * (state.size.width / state.size.height);
      group.current.position.x = 0.25 * viewW; // +25% from center = 75% of screen
    }
  });

  return (
    <group
      ref={group}
      // x is computed every frame to stay centered in the right half
      position={[0, 2, -20]}
    >
      <group rotation={[1.22, 0, 0]}>
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
  useFrame(() => {
    const targetZ = 78 - progress * 50; // 78 → 28
    camera.position.z += (targetZ - camera.position.z) * 0.06;
    camera.position.y += (2 - camera.position.y) * 0.06;
    // look straight ahead; right-half centering is handled by the hole's group position
    camera.lookAt(0, 1, -20);
  });
  return null;
}

/** Inner pages: same star pattern, no journey — a gentle fixed drift. */
function AmbientCamera() {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.z += (78 - camera.position.z) * 0.05;
    camera.position.y += (2 - camera.position.y) * 0.05;
    camera.lookAt(0, 1, -20);
  });
  return null;
}

function Scene({
  mode,
  progress,
  activeRing,
  hole,
}: {
  mode: "journey" | "ambient";
  progress: number;
  activeRing: number;
  hole: boolean;
}) {
  return (
    <>
      {mode === "journey" ? <FallCamera progress={progress} /> : <AmbientCamera />}
      <StarField />
      {hole && <BlackHole activeRing={activeRing} />}
      <EffectComposer>
        <Bloom intensity={1.1} luminanceThreshold={0.15} mipmapBlur radius={0.7} />
      </EffectComposer>
    </>
  );
}

/**
 * The Event Horizon — the 3D world backdrop.
 * mode="journey" (homepage): scroll-driven fall, hole + chapter rings.
 * mode="ambient" (inner pages): same star pattern, no hole, no rings.
 * The hole renders on desktop only (lg+) on every viewport.
 */
export default function WorldCanvas({
  mode = "ambient",
  hole = false,
  progress = 0,
  activeRing = 0,
}: {
  mode?: "journey" | "ambient";
  hole?: boolean;
  progress?: number;
  activeRing?: number;
}) {
  const [webgl, setWebgl] = useState(false);
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      setWebgl(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setWebgl(false);
    }
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const showHole = hole && desktop;

  return (
    <div className="fixed inset-0 z-0" aria-hidden>
      {webgl ? (
        <Canvas camera={{ position: [0, 2, 78], fov: 55 }} dpr={[1, 1.75]}>
          <Suspense fallback={null}>
            <Scene
              mode={mode}
              progress={progress}
              activeRing={activeRing}
              hole={showHole}
            />
          </Suspense>
        </Canvas>
      ) : (
        <div className="h-full w-full bg-[radial-gradient(ellipse_at_50%_45%,#1a2a4a_0%,#07070a_65%)]" />
      )}
    </div>
  );
}
