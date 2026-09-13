"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Billboard, Html, OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useReducedMotion } from "motion/react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, Maximize2, Minus, Plus, RotateCcw } from "lucide-react";
import HelixCanvas from "./HelixCanvas";
import DNAStrand from "./DNAStrand";
import SceneLights from "./SceneLights";
import { DEFAULT_HELIX, HelixConfig, getGlowTexture, radialDirection, strandPoint } from "./helix";
import { ALL_TRAITS } from "@/lib/traits/traitDatabase";
import { CATEGORIES, CATEGORY_MAP } from "@/lib/traits/categories";
import { TraitDefinition } from "@/lib/traits/types";
import { useTraitHref } from "@/lib/hooks/useTraitHref";

const EXPLORER_CFG: HelixConfig = { ...DEFAULT_HELIX, pairs: 112 };
const HOME_POSITION = new THREE.Vector3(0, 4.5, 19);
const HOME_TARGET = new THREE.Vector3(0, 0, 0);
const FOCUS_DISTANCE = 6.5;

interface Marker {
  trait: TraitDefinition;
  index: number;
  anchor: THREE.Vector3;
  position: THREE.Vector3;
  color: string;
}

function useMarkers(): Marker[] {
  return useMemo(() => {
    const n = ALL_TRAITS.length;
    return ALL_TRAITS.map((trait, i) => {
      const index = Math.round(((i + 0.5) / n) * (EXPLORER_CFG.pairs - 1));
      const anchor = strandPoint(index, 0, EXPLORER_CFG);
      const position = anchor.clone().add(radialDirection(index, EXPLORER_CFG).multiplyScalar(0.62));
      return { trait, index, anchor, position, color: CATEGORY_MAP.get(trait.category)?.color ?? "#8f7cff" };
    });
  }, []);
}

const UP = new THREE.Vector3(0, 1, 0);

/** Thin connector from the backbone to a floating marker. */
function Segment({ from, to, color, opacity }: { from: THREE.Vector3; to: THREE.Vector3; color: string; opacity: number }) {
  const { position, quaternion, length } = useMemo(() => {
    const dir = to.clone().sub(from);
    const length = dir.length();
    const quaternion = new THREE.Quaternion().setFromUnitVectors(UP, dir.normalize());
    const position = from.clone().add(to).multiplyScalar(0.5);
    return { position, quaternion, length };
  }, [from, to]);
  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[0.018, 0.018, length, 6]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} />
    </mesh>
  );
}

function MarkerNode({
  marker,
  active,
  hovered,
  dimmed,
  onHover,
  onSelect,
}: {
  marker: Marker;
  active: boolean;
  hovered: boolean;
  dimmed: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}) {
  const ring = useRef<THREE.Mesh>(null);
  const glow = useMemo(() => getGlowTexture(), []);
  useFrame(({ clock }) => {
    if (!ring.current) return;
    const s = 1 + Math.sin(clock.elapsedTime * 3) * 0.12;
    ring.current.scale.setScalar(s);
  });
  const opacity = dimmed ? 0.18 : 1;
  const label = hovered || active;

  return (
    <group>
      <Segment from={marker.anchor} to={marker.position} color={marker.color} opacity={dimmed ? 0.1 : 0.55} />
      <group position={marker.position}>
        <mesh
          onPointerOver={(e) => { e.stopPropagation(); onHover(marker.trait.id); }}
          onPointerOut={() => onHover(null)}
          onClick={(e) => { e.stopPropagation(); onSelect(marker.trait.id); }}
          scale={hovered || active ? 1.35 : 1}
        >
          <sphereGeometry args={[0.17, 24, 24]} />
          <meshStandardMaterial
            color={marker.color}
            emissive={marker.color}
            emissiveIntensity={active ? 1.6 : hovered ? 1.1 : 0.7}
            toneMapped={false}
            transparent
            opacity={opacity}
          />
        </mesh>
        <sprite scale={[1.3, 1.3, 1]}>
          <spriteMaterial map={glow} color={marker.color} transparent opacity={dimmed ? 0.05 : active ? 0.75 : 0.4} depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
        {active && (
          <Billboard>
            <mesh ref={ring}>
              <ringGeometry args={[0.32, 0.36, 48]} />
              <meshBasicMaterial color={marker.color} transparent opacity={0.9} side={THREE.DoubleSide} toneMapped={false} />
            </mesh>
          </Billboard>
        )}
        {label && !dimmed && (
          <Html position={[0, 0.45, 0]} center zIndexRange={[20, 0]} style={{ pointerEvents: "none", transform: "translateY(-100%)" }}>
            <div className="glass-card px-3 py-2 whitespace-nowrap shadow-2xl" style={{ borderColor: `${marker.color}55` }}>
              <div className="text-[10px] font-mono tracking-wide" style={{ color: marker.color }}>
                {marker.trait.gene} · {marker.trait.rsids[0]}
              </div>
              <div className="text-xs font-semibold text-[var(--color-foreground)]">{marker.trait.name}</div>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}

interface SceneProps {
  markers: Marker[];
  selectedId: string | null;
  hoveredId: string | null;
  category: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string | null) => void;
  resetToken: number;
  zoomDelta: number;
  zoomEnabled: boolean;
  reduced: boolean;
}

function ExplorerScene({ markers, selectedId, hoveredId, category, onHover, onSelect, resetToken, zoomDelta, zoomEnabled, reduced }: SceneProps) {
  const controls = useRef<OrbitControlsImpl>(null);
  const spinner = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const flight = useRef<{ target: THREE.Vector3; position: THREE.Vector3 } | null>(null);
  const [hoveredPair, setHoveredPair] = useState<number | null>(null);

  const flyTo = useCallback((target: THREE.Vector3, distance: number) => {
    const ctl = controls.current;
    if (!ctl) return;
    const dir = camera.position.clone().sub(ctl.target).normalize();
    if (dir.lengthSq() < 0.001) dir.set(0, 0.35, 1).normalize();
    flight.current = { target: target.clone(), position: target.clone().add(dir.multiplyScalar(distance)) };
  }, [camera]);

  // Fly to the selected marker.
  useEffect(() => {
    const marker = markers.find((m) => m.trait.id === selectedId);
    if (!marker || !spinner.current) return;
    const world = spinner.current.localToWorld(marker.position.clone());
    flyTo(world, FOCUS_DISTANCE);
  }, [selectedId, markers, flyTo]);

  // Reset to the home view.
  const firstReset = useRef(true);
  useEffect(() => {
    if (firstReset.current) { firstReset.current = false; return; }
    flight.current = { target: HOME_TARGET.clone(), position: HOME_POSITION.clone() };
  }, [resetToken]);

  // Button zoom: move along the view direction.
  const lastZoom = useRef(zoomDelta);
  useEffect(() => {
    if (zoomDelta === lastZoom.current) return;
    const step = zoomDelta > lastZoom.current ? 0.78 : 1.28;
    lastZoom.current = zoomDelta;
    const ctl = controls.current;
    if (!ctl) return;
    const offset = camera.position.clone().sub(ctl.target).multiplyScalar(step);
    const len = THREE.MathUtils.clamp(offset.length(), 3, 40);
    offset.setLength(len);
    flight.current = { target: ctl.target.clone(), position: ctl.target.clone().add(offset) };
  }, [zoomDelta, camera]);

  useFrame((_, delta) => {
    const ctl = controls.current;
    if (spinner.current && !selectedId && !reduced) spinner.current.rotation.y += delta * 0.12;
    if (flight.current && ctl) {
      const k = 1 - Math.exp(-5 * delta);
      ctl.target.lerp(flight.current.target, k);
      camera.position.lerp(flight.current.position, k);
      if (camera.position.distanceTo(flight.current.position) < 0.02) flight.current = null;
    }
    ctl?.update();
  });

  return (
    <>
      <SceneLights />
      <fog attach="fog" args={["#0a0a14", 18, 42]} />
      <OrbitControls
        ref={controls}
        enablePan={false}
        enableZoom={zoomEnabled}
        enableDamping
        dampingFactor={0.08}
        minDistance={3}
        maxDistance={40}
        rotateSpeed={0.6}
        makeDefault
      />
      <group rotation={[0, 0, -Math.PI / 2]}>
        <group ref={spinner}>
          <DNAStrand cfg={EXPLORER_CFG} seed={2024} hovered={hoveredPair} onHover={setHoveredPair} dim={selectedId ? 0.75 : 1} />
          {markers.map((m) => (
            <MarkerNode
              key={m.trait.id}
              marker={m}
              active={m.trait.id === selectedId}
              hovered={m.trait.id === hoveredId}
              dimmed={!!category && m.trait.category !== category}
              onHover={onHover}
              onSelect={(id) => onSelect(id)}
            />
          ))}
        </group>
      </group>
      {/* Click empty space to clear the selection */}
      <mesh onClick={() => onSelect(null)} position={[0, 0, -30]} visible={false}>
        <planeGeometry args={[400, 400]} />
      </mesh>
    </>
  );
}

interface GenomeExplorerProps {
  /** Landing-page embed: fixed height, wheel zoom off so the page still scrolls. */
  compact?: boolean;
  initialTraitId?: string | null;
  className?: string;
}

export default function GenomeExplorer({ compact = false, initialTraitId = null, className = "" }: GenomeExplorerProps) {
  const reduced = useReducedMotion() ?? false;
  const markers = useMarkers();
  const traitHref = useTraitHref();
  const [selectedId, setSelectedId] = useState<string | null>(initialTraitId);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState(0);
  const [zoomDelta, setZoomDelta] = useState(0);

  const selected = selectedId ? markers.find((m) => m.trait.id === selectedId) ?? null : null;
  const selectedCategory = selected ? CATEGORY_MAP.get(selected.trait.category) : null;
  const visibleTraits = category ? ALL_TRAITS.filter((t) => t.category === category) : ALL_TRAITS;

  const reset = () => { setSelectedId(null); setResetToken((t) => t + 1); };

  return (
    <div className={`glass-card overflow-hidden flex flex-col ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 px-4 sm:px-5 py-3 border-b border-[var(--color-glass-border)]">
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar flex-1 min-w-0">
          <button
            onClick={() => setCategory(null)}
            className={`pill shrink-0 transition-colors ${!category ? "!border-[rgba(143,124,255,0.5)] !text-[var(--color-foreground)] !bg-[rgba(143,124,255,0.08)]" : "hover:text-[var(--color-foreground)]"}`}
          >
            All traits
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(category === c.id ? null : c.id)}
              className={`pill shrink-0 transition-colors ${category === c.id ? "!text-[var(--color-foreground)]" : "hover:text-[var(--color-foreground)]"}`}
              style={category === c.id ? { borderColor: `${c.color}80`, background: `${c.color}1a` } : undefined}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.color }} />
              {c.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={() => setZoomDelta((z) => z + 1)} className="btn-ghost !p-2" aria-label="Zoom in" title="Zoom in"><Plus className="w-4 h-4" /></button>
          <button onClick={() => setZoomDelta((z) => z - 1)} className="btn-ghost !p-2" aria-label="Zoom out" title="Zoom out"><Minus className="w-4 h-4" /></button>
          <button onClick={reset} className="btn-ghost !p-2" aria-label="Reset view" title="Reset view"><RotateCcw className="w-4 h-4" /></button>
          {compact && (
            <Link href="/explore" className="btn-ghost !p-2" aria-label="Open full-screen explorer" title="Full screen"><Maximize2 className="w-4 h-4" /></Link>
          )}
        </div>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-[1fr_320px] ${compact ? "" : "flex-1 min-h-0"}`}>
        {/* Scene */}
        <div className={`relative ${compact ? "h-[420px] sm:h-[520px]" : "h-[55vh] lg:h-full min-h-[420px]"}`}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(143,124,255,0.07),transparent_65%)]" />
          <HelixCanvas
            className="absolute inset-0"
            camera={{ position: HOME_POSITION.toArray(), fov: 40, near: 0.1, far: 80 }}
            fallback={<div className="absolute inset-0 flex items-center justify-center text-sm text-[var(--color-muted)]">WebGL is unavailable in this browser.</div>}
          >
            <ExplorerScene
              markers={markers}
              selectedId={selectedId}
              hoveredId={hoveredId}
              category={category}
              onHover={setHoveredId}
              onSelect={setSelectedId}
              resetToken={resetToken}
              zoomDelta={zoomDelta}
              zoomEnabled={!compact}
              reduced={reduced}
            />
          </HelixCanvas>
          <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3 text-[11px] text-[var(--color-muted)] whitespace-nowrap">
            <span>Drag to orbit</span>
            <span className="w-1 h-1 rounded-full bg-[var(--color-muted)]/50" />
            <span>{compact ? "Buttons to zoom" : "Scroll to zoom"}</span>
            <span className="w-1 h-1 rounded-full bg-[var(--color-muted)]/50" />
            <span>Click a marker</span>
          </div>
        </div>

        {/* Panel */}
        <aside className="border-t lg:border-t-0 lg:border-l border-[var(--color-glass-border)] flex flex-col min-h-0">
          {selected && selectedCategory ? (
            <div className="p-5 flex flex-col gap-4 overflow-y-auto thin-scrollbar">
              <button onClick={() => setSelectedId(null)} className="flex items-center gap-1 text-xs text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors self-start">
                <ChevronLeft className="w-3.5 h-3.5" /> All markers
              </button>
              <div>
                <span className="pill mb-3" style={{ borderColor: `${selectedCategory.color}66`, color: selectedCategory.color, background: `${selectedCategory.color}14` }}>
                  {selectedCategory.name}
                </span>
                <h3 className="text-lg font-semibold leading-tight">{selected.trait.name}</h3>
                <p className="text-sm text-[var(--color-muted)] mt-1">{selected.trait.subtitle}</p>
                <p className="font-mono text-[11px] text-[var(--color-muted)] mt-2 break-all">
                  {selected.trait.gene} · {selected.trait.rsids.join(", ")}
                </p>
              </div>
              <p className="text-sm text-[var(--color-foreground)]/80 leading-relaxed line-clamp-5">{selected.trait.description}</p>
              {selected.trait.variants.length > 0 && (
                <div>
                  <p className="eyebrow !text-[10px] mb-2">Possible results</p>
                  <ul className="space-y-1.5">
                    {selected.trait.variants.map((v) => (
                      <li key={v.genotype} className="flex items-center gap-2 text-xs">
                        <span className={`w-1.5 h-1.5 rounded-full dot-${v.color}`} />
                        <span className="font-mono text-[var(--color-muted)] w-8">{v.genotype}</span>
                        <span className="text-[var(--color-foreground)]/85">{v.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Link href={traitHref(selected.trait.id)} className="btn-neon-outline !text-sm mt-auto">
                See this trait in the demo genome <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col min-h-0">
              <div className="px-5 pt-5 pb-3">
                <p className="eyebrow !text-[10px]">{visibleTraits.length} markers</p>
                <p className="text-sm text-[var(--color-muted)] mt-1">Each glowing node is a SNP the app reads from your file. Hover to preview, click to fly in.</p>
              </div>
              <ul className={`overflow-y-auto thin-scrollbar px-2 pb-3 ${compact ? "max-h-[360px]" : "flex-1"}`}>
                {visibleTraits.map((t) => {
                  const c = CATEGORY_MAP.get(t.category);
                  return (
                    <li key={t.id}>
                      <button
                        onClick={() => setSelectedId(t.id)}
                        onMouseEnter={() => setHoveredId(t.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${hoveredId === t.id ? "bg-white/[0.06]" : "hover:bg-white/[0.04]"}`}
                      >
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c?.color }} />
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm truncate">{t.name}</span>
                          <span className="block font-mono text-[10px] text-[var(--color-muted)]">{t.gene}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
