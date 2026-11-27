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

const TILT = 1.22; // disk/ring system tilt about the x-axis
const SIN_TILT = Math.sin(TILT);
const COS_TILT = Math.cos(TILT);
const R_OUT = 21.5; // outermost orbit ring radius (largest RING_INFO r)

const RING_INFO = [
  { r: 21.5, color: "#5c86b8", opacity: 0.22 }, // 1st year — outermost
  { r: 20.0, color: "#6f9fd8", opacity: 0.26 },
  { r: 18.5, color: "#89b4e4", opacity: 0.3 },
  { r: 17.0, color: "#a9c8ee", opacity: 0.34 },
  { r: 15.5, color: "#cfe4ff", opacity: 0.38 }, // 4th year — innermost, now
];

function SolarSystem({
  activeRing,
  progress,
}: {
  activeRing: number;
  progress: number;
}) {
  const group = useRef<THREE.Group>(null);
  // the sun itself: radial gradient so the limb softens into the glow
  const sun = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, "#fff3d6");
    g.addColorStop(0.3, "#ffc857");
    g.addColorStop(0.55, "rgba(255,200,87,0.5)");
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }, []);
  const haloGlow = useStarTexture("#c98f3f");

  useFrame((state, delta) => {
    if (group.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 1.3) * 0.008;

      const cam = state.camera as THREE.PerspectiveCamera;
      const dist = cam.position.z - group.current.position.z;

      // The camera's fall makes the hole grow on approach; counter it with a
      // distance-proportional scale so the orbit starts big and shrinks as you
      // scroll down (grows back when you scroll up). The extra (1 - 0.35 *
      // progress) factor makes it end at ~65% of the apparent start size.
      // Desktop (>=1280px) gets the 1.4x bump; tablet-size stays unchanged.
      const constSize = dist / 98; // 98 = camera distance at the top
      const shrink = 1 - 0.35 * progress; // 1 → 0.65
      const base = (state.size.width >= 1280 ? 1.4 : 1) * constSize * shrink;
      const total = base * s;
      group.current.scale.setScalar(total);

      // Skew-aware centering: the ring system is huge and steeply tilted, so
      // plain "place group at 75% width" projects an ellipse whose bounds are
      // skewed toward the camera-facing side. Sample the outer ring's projected
      // extent and position the group so the BOUNDS center at 75% of the width.
      const aspect = state.size.width / state.size.height;
      const tanY = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
      const tanX = tanY * aspect;
      // camera pitch toward the lookAt target (0, 1, -20)
      const pitch = Math.atan2(cam.position.y - 1, cam.position.z + 20);
      const sinP = Math.sin(pitch);
      const cosP = Math.cos(pitch);
      let x0 = group.current.position.x;
      for (let iter = 0; iter < 3; iter++) {
        let minF = Infinity;
        let maxF = -Infinity;
        for (let k = 0; k < 64; k++) {
          const th = (k / 64) * Math.PI * 2;
          const dx = x0 + R_OUT * Math.cos(th) * total;
          const dy = 2 + R_OUT * Math.sin(th) * COS_TILT * total - cam.position.y;
          const dz = -20 + R_OUT * Math.sin(th) * SIN_TILT * total - cam.position.z;
          const qz = -dy * sinP - dz * cosP; // depth along camera forward
          const fx = dx / (qz * tanX); // -1..1 across the screen
          if (fx < minF) minF = fx;
          if (fx > maxF) maxF = fx;
        }
        const centerF = (minF + maxF) / 2;
        x0 += (0.5 - centerF) * tanX * dist; // 0.5 → 75% of screen width
      }
      group.current.position.x = x0;
    }
  });

  return (
    <group
      ref={group}
      // x is computed every frame to stay centered in the right half
      position={[0, 2, -20]}
    >
      <group rotation={[TILT, 0, 0]}>
        {/* orbit guides = chapter rings — coplanar with the sun and outside
            its edge, so they read as real orbits around it */}
        {RING_INFO.map((ring, i) => (
          <mesh key={i}>
            <torusGeometry args={[ring.r, 0.12, 8, 128]} />
            <meshBasicMaterial
              color={ring.color}
              transparent
              opacity={i === activeRing ? 0.9 : ring.opacity}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
        {/* the sun — a disc lying in the ring plane, so it projects with the
            exact same ellipse shape as the orbits */}
        <mesh>
          <circleGeometry args={[6.5, 64]} />
          <meshBasicMaterial
            map={sun}
            transparent
            opacity={0.95}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
      {/* wide faint halo so the light reads without blinding */}
      <sprite scale={[20, 20, 1]}>
        <spriteMaterial
          map={haloGlow}
          color="#c98f3f"
          transparent
          opacity={0.15}
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
  sun,
}: {
  mode: "journey" | "ambient";
  progress: number;
  activeRing: number;
  sun: boolean;
}) {
  return (
    <>
      {mode === "journey" ? <FallCamera progress={progress} /> : <AmbientCamera />}
      <StarField />
      {sun && <SolarSystem activeRing={activeRing} progress={progress} />}
      <EffectComposer>
        <Bloom intensity={1.1} luminanceThreshold={0.15} mipmapBlur radius={0.7} />
      </EffectComposer>
    </>
  );
}

/**
 * The Event Horizon — the 3D world backdrop.
 * mode="journey" (homepage): scroll-driven fall, sun + chapter rings.
 * mode="ambient" (inner pages): same star pattern, no sun, no rings.
 * The sun renders on desktop only (lg+) on every viewport.
 */
export default function WorldCanvas({
  mode = "ambient",
  sun = false,
  progress = 0,
  activeRing = 0,
}: {
  mode?: "journey" | "ambient";
  sun?: boolean;
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

  const showSun = sun && desktop;

  return (
    <div className="fixed inset-0 z-0" aria-hidden>
      {webgl ? (
        <Canvas camera={{ position: [0, 2, 78], fov: 55 }} dpr={[1, 1.75]}>
          <Suspense fallback={null}>
            <Scene
              mode={mode}
              progress={progress}
              activeRing={activeRing}
              sun={showSun}
            />
          </Suspense>
        </Canvas>
      ) : (
        <div className="h-full w-full bg-[radial-gradient(ellipse_at_50%_45%,#1a2a4a_0%,#07070a_65%)]" />
      )}
    </div>
  );
}
