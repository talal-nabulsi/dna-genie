"use client";

/** Falloff-free lighting rig shared by every helix scene. */
export default function SceneLights() {
  return (
    <>
      <hemisphereLight args={["#d7d0f5", "#04140a", 0.7]} />
      <directionalLight position={[6, 9, 7]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-7, -4, -5]} intensity={0.9} color="#8f7cff" />
      <directionalLight position={[0, -8, 4]} intensity={0.5} color="#d896c8" />
    </>
  );
}
