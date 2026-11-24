"use client";

import { Component, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { useReducedMotion } from "motion/react";

type Base = "A" | "C" | "G" | "T";
const COMP: Record<Base, Base> = { A: "T", T: "A", C: "G", G: "C" };
/** Purines have two rings and reach further toward the middle than pyrimidines. */
const PURINE = (b: Base) => b === "A" || b === "G";
const FULL: Record<Base, string> = { A: "#17804b", C: "#1c57cf", G: "#343a46", T: "#cb2f2a" };

const RISE = 0.34, TURN = 10.5, RADIUS = 1, OFFSET = 2.36;
const BLUE = "#1b3fb5", RED = "#a8172f";

const X = new THREE.Vector3(1, 0, 0);
const m = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), s = new THREE.Vector3(), c = new THREE.Color();

export interface HelixProps {
  /** Plus-strand sequence, 5' to 3'. */
  seq: string;
  /** Index of the pair to light. */
  focus: number;
  /** "quiet" tints bases by strand and lights one pair. "bases" uses chromatogram colors throughout. */
  mode: "quiet" | "bases";
  fov?: number;
  /** Pairs to fit across the canvas. */
  across: number;
  /** Where the focus pair sits across the canvas, 0 to 1. */
  at?: number;
  /** Lean of the axis, in radians. */
  tilt?: number;
}

function Strands({ seq, focus, mode }: Pick<HelixProps, "seq" | "focus" | "mode">) {
  const n = seq.length;
  const bases = useRef<THREE.InstancedMesh>(null);
  const bonds = useRef<THREE.InstancedMesh>(null);

  const { tubeA, tubeB, ends } = useMemo(() => {
    const at = (i: number, k: 0 | 1) => {
      const t = (i / TURN) * Math.PI * 2 + (k ? OFFSET : 0);
      return new THREE.Vector3((i - focus) * RISE, Math.cos(t) * RADIUS, Math.sin(t) * RADIUS);
    };
    const line = (k: 0 | 1) => new THREE.CatmullRomCurve3(Array.from({ length: n * 2 }, (_, i) => at(i / 2, k)));
    return {
      tubeA: new THREE.TubeGeometry(line(0), n * 8, 0.12, 16),
      tubeB: new THREE.TubeGeometry(line(1), n * 8, 0.12, 16),
      ends: Array.from({ length: n }, (_, i) => [at(i, 0), at(i, 1)] as const),
    };
  }, [n, focus]);
  const slab = useMemo(() => new RoundedBoxGeometry(1, 1, 1, 3, 0.16), []);
  useEffect(() => () => { tubeA.dispose(); tubeB.dispose(); }, [tubeA, tubeB]);

  useLayoutEffect(() => {
    const mesh = bases.current, dots = bonds.current;
    if (!mesh || !dots) return;
    let d = 0;
    for (let i = 0; i < n; i++) {
      const b = seq[i] as Base, pair = [b, COMP[b]] as const;
      const [a, z] = ends[i];
      const dir = z.clone().sub(a), len = dir.length();
      dir.normalize();
      q.setFromUnitVectors(X, dir);
      const lit = i === focus;
      const share = PURINE(b) ? 0.57 : 0.43, gap = 0.2;
      const la = (len - gap) * share, lb = (len - gap) * (1 - share);
      [[0, la, a, 1], [1, lb, z, -1]].forEach(([k, L, from, sign]) => {
        const l = L as number;
        p.copy(from as THREE.Vector3).addScaledVector(dir, ((sign as number) * l) / 2);
        s.set(l, lit ? 0.62 : 0.5, lit ? 0.2 : 0.11);
        // Turn each slab so its thin side faces along the helix axis.
        const axis = new THREE.Matrix4().lookAt(new THREE.Vector3(), X, dir);
        const ex = dir.clone(), ez = X.clone(), ey = new THREE.Vector3().crossVectors(ez, ex).normalize();
        axis.makeBasis(ex, ey, ez);
        q.setFromRotationMatrix(axis);
        m.compose(p, q, s);
        mesh.setMatrixAt(i * 2 + (k as number), m);
        c.set(mode === "bases" || lit ? FULL[pair[k as number]] : k ? "#efc3c8" : "#bccbf6");
        mesh.setColorAt(i * 2 + (k as number), c);
      });
      const count = b === "A" || b === "T" ? 2 : 3;
      const mid = a.clone().addScaledVector(dir, la + gap / 2);
      const side = new THREE.Vector3().crossVectors(X, dir).normalize();
      for (let h = 0; h < 3; h++) {
        p.copy(mid).addScaledVector(side, (h - (count - 1) / 2) * 0.12);
        const sc = h < count ? (lit ? 0.05 : 0.036) : 0.0001;
        m.compose(p, q, s.set(sc, sc, sc));
        dots.setMatrixAt(d++, m);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
    dots.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [seq, focus, mode, ends, n]);

  return (
    <group>
      <mesh geometry={tubeA}><meshPhysicalMaterial color={BLUE} roughness={0.38} clearcoat={0.5} clearcoatRoughness={0.35} /></mesh>
      <mesh geometry={tubeB}><meshPhysicalMaterial color={RED} roughness={0.38} clearcoat={0.5} clearcoatRoughness={0.35} /></mesh>
      <instancedMesh key={`b${n}`} ref={bases} args={[slab, undefined, n * 2]} frustumCulled={false}>
        <meshPhysicalMaterial roughness={0.42} clearcoat={0.35} clearcoatRoughness={0.4} />
      </instancedMesh>
      <instancedMesh key={`h${n}`} ref={bonds} args={[undefined, undefined, n * 3]} frustumCulled={false}>
        <sphereGeometry args={[1, 12, 12]} /><meshStandardMaterial color="#0e1a2b" roughness={0.6} />
      </instancedMesh>
    </group>
  );
}

function Rig({ still, spinRef, fov, across, at = 0.5, tilt = 0, children }: { still: boolean; spinRef: React.RefObject<{ v: number; held: boolean }>; fov: number; across: number; at?: number; tilt?: number; children: ReactNode }) {
  const g = useRef<THREE.Group>(null);
  const { camera, size, invalidate } = useThree();
  useLayoutEffect(() => {
    const aspect = size.width / size.height, half = Math.tan((fov * Math.PI) / 360);
    const byWidth = (across * RISE) / (2 * half * aspect), byHeight = 1.45 / half;
    const z = Math.max(byWidth, byHeight);
    camera.position.set((0.5 - at) * 2 * half * z * aspect, 0.35, z);
    camera.lookAt(camera.position.x, 0, 0);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size, fov, across, at, invalidate]);
  useFrame((_, dt) => {
    if (!g.current) return;
    const d = Math.min(dt, 0.05), sp = spinRef.current;
    g.current.rotation.x += ((still || sp.held ? 0 : 0.16) + sp.v) * d;
    sp.v *= Math.exp(-3.2 * d);
  });
  return <group rotation={[0, 0, tilt]}><group ref={g} rotation={[0.9, 0, 0]}>{children}</group></group>;
}

class Boundary extends Component<{ children: ReactNode }, { bad: boolean }> {
  state = { bad: false };
  static getDerivedStateFromError() { return { bad: true }; }
  render() { return this.state.bad ? <p className="small muted" style={{ padding: 24 }}>This browser cannot draw the 3D helix. Everything else works.</p> : this.props.children; }
}

export default function Helix3D({ fov = 26, ...h }: HelixProps) {
  const box = useRef<HTMLDivElement>(null);
  const still = useReducedMotion() ?? false;
  const spin = useRef({ v: 0, held: false });
  const [seen, setSeen] = useState(true);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { rootMargin: "80px" });
    io.observe(el);
    let y = 0;
    const down = (e: PointerEvent) => { spin.current.held = true; y = e.clientY + e.clientX * 0.4; };
    const move = (e: PointerEvent) => { if (!spin.current.held) return; const n = e.clientY + e.clientX * 0.4; spin.current.v += (n - y) * 0.07; y = n; };
    const up = () => { spin.current.held = false; };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => { io.disconnect(); el.removeEventListener("pointerdown", down); window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up); };
  }, []);

  return (
    <div ref={box} style={{ position: "absolute", inset: 0 }} role="img" aria-label="A rotating DNA double helix drawn from the real sequence around this marker">
      <Boundary>
        <Canvas dpr={[1, 1.8]} frameloop={seen ? "always" : "never"} camera={{ fov, near: 0.1, far: 120 }} flat gl={{ alpha: true, antialias: true }}>
          <ambientLight intensity={0.9} />
          <directionalLight position={[3, 6, 7]} intensity={1.5} />
          <directionalLight position={[-6, -3, 3]} intensity={0.5} color="#dfe8ff" />
          <Environment resolution={128} frames={1}>
            <Lightformer intensity={1.6} position={[0, 6, 2]} scale={[18, 2, 1]} rotation-x={-Math.PI / 2} />
            <Lightformer intensity={0.5} position={[0, 2, 8]} scale={[18, 2, 1]} />
            <Lightformer intensity={0.7} position={[0, -5, -3]} scale={[18, 4, 1]} rotation-x={Math.PI / 2} color="#cfe0ff" />
          </Environment>
          <Rig still={still} spinRef={spin} fov={fov} across={h.across} at={h.at} tilt={h.tilt}><Strands seq={h.seq} focus={h.focus} mode={h.mode} /></Rig>
        </Canvas>
      </Boundary>
    </div>
  );
}
