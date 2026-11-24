import { ImageResponse } from "next/og";

export const alt = "DNA Genie. Read your DNA beside your blood test.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const N = 72, W = 1200, MID = 470, R = 92;
const pt = (i: number, off: number) => [(i / (N - 1)) * (W + 80) - 40, MID + Math.cos((i / 10.5) * Math.PI * 2 + off) * R] as const;
const path = (off: number) => Array.from({ length: N * 4 }, (_, k) => pt(k / 4, off)).map(([x, y], k) => `${k ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#fbf3f5", color: "#2a1238", position: "relative" }}>
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", left: 0, top: 0 }}>
          {Array.from({ length: N }, (_, i) => { const [x, a] = pt(i, 0), [, b] = pt(i, 2.36); return <line key={i} x1={x} x2={x} y1={a} y2={b} stroke={i === 36 ? "#2a1238" : "#e3cfe6"} strokeWidth={i === 36 ? 12 : 7} />; })}
          <path d={path(0)} fill="none" stroke="#5a2a8c" strokeWidth="13" />
          <path d={path(2.36)} fill="none" stroke="#d0356b" strokeWidth="13" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", padding: "64px 72px" }}>
          <div style={{ fontSize: 32, fontWeight: 600 }}>DNA Genie</div>
          <div style={{ fontSize: 82, lineHeight: 1.02, letterSpacing: -3, marginTop: 26, maxWidth: 1040 }}>Read your DNA beside your blood test.</div>
        </div>
      </div>
    ),
    size,
  );
}
