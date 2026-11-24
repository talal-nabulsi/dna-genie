"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { Molecule as Engine, Pose, Site } from "@/lib/molecule/engine";

interface Props {
  site: Site;
  /** Show the other letter at the marked pair. */
  alt?: boolean;
  pose: Pose;
  label: string;
  onFrame?: (p: { x: number; y: number; settled: boolean }) => void;
  onReady?: (e: Engine) => void;
}

/** B-DNA drawn from atom positions. Drag to turn it. */
export default function Molecule({ site, alt = false, pose, label, onFrame, onReady }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const engine = useRef<Engine | null>(null);
  const latest = useRef({ site, alt, pose, onFrame, onReady });
  const still = useReducedMotion() ?? false;
  const [bad, setBad] = useState(false);
  useEffect(() => { latest.current = { site, alt, pose, onFrame, onReady }; });

  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    let gone = false, off = () => {};
    import("@/lib/molecule/engine").then(({ Molecule: M }) => {
      if (gone) return;
      let e: Engine;
      try { e = new M(cv, latest.current.pose); } catch { setBad(true); return; }
      engine.current = e;
      e.still = still;
      e.onFrame = (p) => latest.current.onFrame?.(p);
      e.go(latest.current.site, latest.current.alt);
      latest.current.onReady?.(e);
      const io = new IntersectionObserver(([x]) => { e.visible = x.isIntersecting; });
      io.observe(cv);
      let on = false, lx = 0, ly = 0;
      const down = (v: PointerEvent) => { on = true; lx = v.clientX; ly = v.clientY; e.press(true); };
      const move = (v: PointerEvent) => {
        if (!on) return;
        const a = e.pose.angle, dx = v.clientX - lx, dy = v.clientY - ly;
        lx = v.clientX; ly = v.clientY;
        // Turn about the axis, by the part of the drag that runs across it.
        e.turn((dy * Math.cos(a) + dx * -Math.sin(a)) * 0.009);
      };
      const up = () => { on = false; e.press(false); };
      cv.addEventListener("pointerdown", down); addEventListener("pointermove", move); addEventListener("pointerup", up); addEventListener("pointercancel", up);
      off = () => { io.disconnect(); cv.removeEventListener("pointerdown", down); removeEventListener("pointermove", move); removeEventListener("pointerup", up); removeEventListener("pointercancel", up); e.dispose(); engine.current = null; };
    }).catch(() => setBad(true));
    return () => { gone = true; off(); };
  }, [still]);

  useEffect(() => { engine.current?.go(site, alt); }, [site, alt]);
  useEffect(() => { engine.current?.setAlt(alt); }, [alt]);
  useEffect(() => { engine.current?.setPose(pose); }, [pose]);

  return (
    <>
      <canvas ref={canvas} className="mol" role="img" aria-label={label} />
      {bad && <p className="mol-bad small">This browser cannot draw the molecule. The rest of the site works.</p>}
    </>
  );
}
