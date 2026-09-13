"use client";

/** Falloff-free lighting rig shared by every helix scene. */
export default function SceneLights() {
  return (
    <>
      <hemisphereLight args={["#c9f7d2", "#04140a", 1.1]} />
      <directionalLight position={[6, 9, 7]} intensity={1.9} color="#ffffff" />
      <directionalLight position={[-7, -4, -5]} intensity={0.9} color="#39ff14" />
      <directionalLight position={[0, -8, 4]} intensity={0.5} color="#38bdf8" />
    </>
  );
}
