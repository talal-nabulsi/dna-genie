/** Six backbone atoms from each strand, crossing. */
export function Mark({ size = 30 }: { size?: number; mono?: boolean }) {
  const a = [[8, 4], [10, 9.5], [14, 14], [18.5, 18], [22, 22.5], [24, 28]];
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" stroke="#2a1038" strokeWidth="1.6">
      {a.map(([x, y], i) => <circle key={`b${i}`} cx={32 - x} cy={y} r="3.6" fill="#b91f52" />)}
      <rect x="11" y="3.4" width="10" height="3.4" rx="1.7" fill="#ffd21f" />
      <rect x="11" y="25.4" width="10" height="3.4" rx="1.7" fill="#ffd21f" />
      {a.map(([x, y], i) => <circle key={`a${i}`} cx={x} cy={y} r="3.6" fill="#5b2c93" />)}
    </svg>
  );
}
