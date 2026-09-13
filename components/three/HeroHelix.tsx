"use client";

import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, Sparkles } from "@react-three/drei";
import { useReducedMotion } from "motion/react";
import HelixCanvas from "./HelixCanvas";
import DNAStrand, { generateSequence } from "./DNAStrand";
import SceneLights from "./SceneLights";
import { BASE_COLORS, BASE_NAMES, COMPLEMENT, DEFAULT_HELIX, HelixConfig, buildHelix } from "./helix";

const HERO_CFG: HelixConfig = { ...DEFAULT_HELIX, pairs: 72 };

interface SpinState {
  velocity: number;
  dragging: boolean;
  lastX: number;
}

function HeroScene({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const spin = useRef<SpinState>({ velocity: 0, dragging: false, lastX: 0 });
  const [hovered, setHovered] = useState<number | null>(null);
  const { pointer, gl } = useThree();
  const data = useMemo(() => buildHelix(HERO_CFG), []);
  const sequence = useMemo(() => generateSequence(HERO_CFG.pairs), []);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const s = spin.current;
    const idle = reduced ? 0 : 0.18;
    g.rotation.y += (idle + s.velocity) * delta;
    s.velocity *= Math.pow(0.08, delta);
    // Gentle parallax toward the cursor.
    const targetX = 0.22 + (reduced ? 0 : -pointer.y * 0.12);
    const targetZ = -0.42 + (reduced ? 0 : pointer.x * 0.08);
    g.rotation.x += (targetX - g.rotation.x) * Math.min(1, delta * 3);
    g.rotation.z += (targetZ - g.rotation.z) * Math.min(1, delta * 3);
  });

  // Custom drag-to-spin: the whole canvas is the handle, no orbit camera needed.
  const onDown = (e: PointerEvent) => {
    spin.current.dragging = true;
    spin.current.lastX = e.clientX;
    gl.domElement.style.cursor = "grabbing";
  };
  const onMove = (e: PointerEvent) => {
    if (!spin.current.dragging) return;
    const dx = e.clientX - spin.current.lastX;
    spin.current.lastX = e.clientX;
    spin.current.velocity += dx * 0.12;
  };
  const onUp = () => {
    spin.current.dragging = false;
    gl.domElement.style.cursor = "grab";
  };

  useMemo(() => {
    const el = gl.domElement;
    el.style.cursor = "grab";
    el.style.touchAction = "pan-y";
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl]);

  const hoverInfo = hovered !== null ? { base: sequence[hovered], pos: data.midpoints[hovered] } : null;

  return (
    <>
      <SceneLights />
      <fog attach="fog" args={["#060907", 7, 17]} />
      <group ref={group} rotation={[0.22, 0, -0.42]}>
        <DNAStrand cfg={HERO_CFG} hovered={hovered} onHover={setHovered} />
        {hoverInfo && (
          <Html position={hoverInfo.pos} center zIndexRange={[10, 0]} style={{ pointerEvents: "none" }}>
            <div className="glass-card px-3 py-2 whitespace-nowrap text-[11px] leading-tight shadow-xl">
              <div className="font-mono text-[10px] text-[var(--color-muted)] mb-0.5">base pair {hovered! + 1}</div>
              <div className="flex items-center gap-1.5 font-semibold">
                <span style={{ color: BASE_COLORS[hoverInfo.base] }}>{BASE_NAMES[hoverInfo.base]}</span>
                <span className="text-[var(--color-muted)]">—</span>
                <span style={{ color: BASE_COLORS[COMPLEMENT[hoverInfo.base]] }}>
                  {BASE_NAMES[COMPLEMENT[hoverInfo.base]]}
                </span>
              </div>
            </div>
          </Html>
        )}
      </group>
      {!reduced && <Sparkles count={90} scale={[9, 16, 9]} size={1.8} speed={0.25} opacity={0.45} color="#7dff5e" />}
    </>
  );
}

/** The hero's draggable, hover-aware helix. Client only — import via next/dynamic. */
export default function HeroHelix({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion() ?? false;
  return (
    <HelixCanvas
      className={className}
      camera={{ position: [0, 0, 10.5], fov: 38, near: 0.1, far: 60 }}
      fallback={<div className="w-full h-full rounded-3xl bg-[radial-gradient(circle_at_50%_40%,rgba(57,255,20,0.18),transparent_60%)]" />}
    >
      <HeroScene reduced={reduced} />
    </HelixCanvas>
  );
}
