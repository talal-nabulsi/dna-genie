"use client";

import { Component, ReactNode, useEffect, useRef, useState } from "react";
import { Canvas, CanvasProps } from "@react-three/fiber";
import * as THREE from "three";

interface HelixCanvasProps {
  children: ReactNode;
  camera?: CanvasProps["camera"];
  className?: string;
  fallback?: ReactNode;
  /** Pause the render loop while the canvas is off-screen (default true). */
  pauseOffscreen?: boolean;
  eventSource?: CanvasProps["eventSource"];
}

class WebGLBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** Shared Canvas wrapper: transparent background, capped DPR, off-screen pausing, WebGL fallback. */
export default function HelixCanvas({
  children,
  camera,
  className = "",
  fallback = null,
  pauseOffscreen = true,
}: HelixCanvasProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    if (!pauseOffscreen || !ref.current) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "120px" });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [pauseOffscreen]);

  return (
    <div ref={ref} className={className}>
      <WebGLBoundary fallback={fallback}>
        <Canvas
          dpr={[1, 1.75]}
          camera={camera}
          frameloop={inView ? "always" : "never"}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.15;
            gl.setClearColor(0x000000, 0);
          }}
          style={{ background: "transparent" }}
        >
          {children}
        </Canvas>
      </WebGLBoundary>
    </div>
  );
}
