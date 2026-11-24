/** Two strands crossing once, with the pair between them. */
export function Mark({ size = 30, mono = false }: { size?: number; mono?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill={mono ? "none" : "#f7c9d6"} stroke={mono ? "currentColor" : "none"} strokeWidth="2" />
      <path d="M10 5.5c0 7 12 9 12 21" stroke={mono ? "currentColor" : "var(--dna)"} strokeWidth="3.6" strokeLinecap="round" />
      <path d="M22 5.5c0 7-12 9-12 21" stroke={mono ? "currentColor" : "var(--blood)"} strokeWidth="3.6" strokeLinecap="round" />
    </svg>
  );
}
