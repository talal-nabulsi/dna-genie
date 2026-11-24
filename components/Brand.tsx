/** Two strands crossing once, with the pair between them. */
export function Mark({ size = 30, mono = false }: { size?: number; mono?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M8 2c0 9 16 11 16 28" stroke={mono ? "currentColor" : "var(--dna)"} strokeWidth="4" />
      <path d="M24 2c0 9-16 11-16 28" stroke={mono ? "currentColor" : "var(--blood)"} strokeWidth="4" />
      <path d="M11 5.5h10M11 26.5h10" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
