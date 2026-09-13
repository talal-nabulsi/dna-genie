"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ThreeEvent } from "@react-three/fiber";
import {
  Base,
  BASE_COLORS,
  COMPLEMENT,
  HelixConfig,
  buildHelix,
  generateSequence,
} from "./helix";

const UP = new THREE.Vector3(0, 1, 0);
const tmpObj = new THREE.Object3D();
const tmpDir = new THREE.Vector3();
const tmpQuat = new THREE.Quaternion();
const tmpColor = new THREE.Color();

interface DNAStrandProps {
  cfg: HelixConfig;
  seed?: number;
  /** Currently hovered base-pair index (highlighted). */
  hovered?: number | null;
  onHover?: (index: number | null) => void;
  /** Multiplies every base colour — used to dim the strand behind a focused marker. */
  dim?: number;
  interactive?: boolean;
}

/**
 * The double helix itself: two smooth backbone tubes, backbone beads, and
 * instanced base-pair rungs coloured per nucleotide (A/T/G/C).
 */
export default function DNAStrand({
  cfg,
  seed = 1337,
  hovered = null,
  onHover,
  dim = 1,
  interactive = true,
}: DNAStrandProps) {
  const data = useMemo(() => buildHelix(cfg), [cfg]);
  const sequence = useMemo(() => generateSequence(cfg.pairs, seed), [cfg.pairs, seed]);

  const rungRef = useRef<THREE.InstancedMesh>(null);
  const beadRef = useRef<THREE.InstancedMesh>(null);

  const tubeA = useMemo(
    () => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(data.strandA), cfg.pairs * 5, 0.05, 10, false),
    [data, cfg.pairs]
  );
  const tubeB = useMemo(
    () => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(data.strandB), cfg.pairs * 5, 0.05, 10, false),
    [data, cfg.pairs]
  );

  useEffect(() => () => { tubeA.dispose(); tubeB.dispose(); }, [tubeA, tubeB]);

  const setRung = (index: number, scale: number, brighten: number) => {
    const mesh = rungRef.current;
    if (!mesh) return;
    const a = data.strandA[index];
    const b = data.strandB[index];
    const mid = data.midpoints[index];
    const base = sequence[index];
    const halves: [THREE.Vector3, THREE.Vector3, Base][] = [
      [a, mid, base],
      [mid, b, COMPLEMENT[base]],
    ];
    halves.forEach(([from, to, nucleotide], h) => {
      const id = index * 2 + h;
      tmpDir.subVectors(to, from);
      const len = tmpDir.length();
      tmpQuat.setFromUnitVectors(UP, tmpDir.normalize());
      tmpObj.position.copy(from).add(to).multiplyScalar(0.5);
      tmpObj.quaternion.copy(tmpQuat);
      tmpObj.scale.set(scale, len, scale);
      tmpObj.updateMatrix();
      mesh.setMatrixAt(id, tmpObj.matrix);
      tmpColor.set(BASE_COLORS[nucleotide]).multiplyScalar(dim).lerp(new THREE.Color("#ffffff"), brighten);
      mesh.setColorAt(id, tmpColor);
    });
  };

  useLayoutEffect(() => {
    const beads = beadRef.current;
    if (!beads) return;
    for (let i = 0; i < cfg.pairs; i++) {
      [data.strandA[i], data.strandB[i]].forEach((p, s) => {
        tmpObj.position.copy(p);
        tmpObj.quaternion.identity();
        tmpObj.scale.setScalar(1);
        tmpObj.updateMatrix();
        beads.setMatrixAt(i * 2 + s, tmpObj.matrix);
      });
      setRung(i, 1, 0);
    }
    beads.instanceMatrix.needsUpdate = true;
    if (rungRef.current) {
      rungRef.current.instanceMatrix.needsUpdate = true;
      if (rungRef.current.instanceColor) rungRef.current.instanceColor.needsUpdate = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, sequence, dim]);

  // Highlight the hovered pair without rebuilding everything.
  const prevHover = useRef<number | null>(null);
  useEffect(() => {
    const mesh = rungRef.current;
    if (!mesh) return;
    if (prevHover.current !== null) setRung(prevHover.current, 1, 0);
    if (hovered !== null) setRung(hovered, 1.6, 0.35);
    prevHover.current = hovered;
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hovered]);

  const handleMove = (e: ThreeEvent<PointerEvent>) => {
    if (!interactive || e.instanceId === undefined) return;
    e.stopPropagation();
    onHover?.(Math.floor(e.instanceId / 2));
  };

  return (
    <group>
      <mesh geometry={tubeA}>
        <meshStandardMaterial color="#b8d9bf" metalness={0.55} roughness={0.32} emissive="#123d1c" emissiveIntensity={0.35} />
      </mesh>
      <mesh geometry={tubeB}>
        <meshStandardMaterial color="#b8d9bf" metalness={0.55} roughness={0.32} emissive="#123d1c" emissiveIntensity={0.35} />
      </mesh>

      <instancedMesh ref={beadRef} args={[undefined, undefined, cfg.pairs * 2]} frustumCulled={false}>
        <sphereGeometry args={[0.13, 18, 18]} />
        <meshStandardMaterial color="#e6f4e8" metalness={0.4} roughness={0.3} emissive="#1b4d26" emissiveIntensity={0.3} />
      </instancedMesh>

      <instancedMesh
        ref={rungRef}
        args={[undefined, undefined, cfg.pairs * 2]}
        frustumCulled={false}
        onPointerMove={handleMove}
        onPointerOut={() => interactive && onHover?.(null)}
      >
        <cylinderGeometry args={[0.062, 0.062, 1, 12]} />
        <meshStandardMaterial color="#e2e2e2" metalness={0.05} roughness={0.55} />
      </instancedMesh>
    </group>
  );
}

export { generateSequence };
