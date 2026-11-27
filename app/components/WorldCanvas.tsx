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

function BlackHole({
  activeRing,
  ambient,
}: {
  activeRing: number;
  ambient: boolean;
}) {
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
    <group
      ref={group}
      // ambient: parked right, out of the content column; journey: centered on its own axis
      position={ambient ? [26, 6, -20] : [narrow ? 0 : 22, narrow ? 12 : 1, -20]}
    >
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
        {/* orbit guides = chapter rings — homepage only; inner pages find them redundant */}
        {ambient
          ? null
          : RING_INFO.map((ring, i) => (
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
    // hole centered on the right side of the layout; mobile: raised above the hero text
    camera.lookAt(viewport.aspect < 1 ? 0 : 7, 1, -20);
  });
  return null;
}

function AmbientCamera() {
  const { camera } = useThree();
  useFrame(({ viewport }) => {
    camera.position.z += (72 - camera.position.z) * 0.05;
    camera.position.y += (4 - camera.position.y) * 0.05;
    camera.lookAt(viewport.aspect < 1 ? 0 : 14, 2, -20);
  });
  return null;
}

function Scene({
  progress,
  activeRing,
  ambient,
}: {
  progress: number;
  activeRing: number;
  ambient: boolean;
}) {
  return (
    <>
      {ambient ? <AmbientCamera /> : <FallCamera progress={progress} />}
      <StarField />
      <BlackHole activeRing={activeRing} ambient={ambient} />
      <EffectComposer>
        <Bloom intensity={1.1} luminanceThreshold={0.15} mipmapBlur radius={0.7} />
      </EffectComposer>
    </>
  );
}

/**
 * The Event Horizon — shared 3D world backdrop.
 * mode="journey": scroll-driven fall toward the horizon (homepage).
 * mode="ambient": slow drift, hole parked right (inner pages, desktop only).
 */
export default function WorldCanvas({
  mode = "ambient",
  progress = 0,
  activeRing = -1,
}: {
  mode?: "journey" | "ambient";
  progress?: number;
  activeRing?: number;
}) {
  const [webgl, setWebgl] = useState(false);

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      setWebgl(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setWebgl(false);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-0" aria-hidden>
      {webgl ? (
        <Canvas camera={{ position: [0, 2, 78], fov: 55 }} dpr={[1, 1.75]}>
          <Suspense fallback={null}>
            <Scene
              progress={progress}
              activeRing={activeRing}
              ambient={mode === "ambient"}
            />
          </Suspense>
        </Canvas>
      ) : (
        <div className="h-full w-full bg-[radial-gradient(ellipse_at_50%_45%,#1a2a4a_0%,#07070a_65%)]" />
      )}
    </div>
  );
}
