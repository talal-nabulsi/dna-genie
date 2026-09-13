import { ImageResponse } from "next/og";

export const alt = "DNA Genie — decode your genome in the browser";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Stylised double helix drawn with SVG so the social card needs no external assets. */
function Helix() {
  const rungs = Array.from({ length: 14 }, (_, i) => i);
  return (
    <svg width="520" height="560" viewBox="0 0 520 560" fill="none">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="520" y2="560" gradientUnits="userSpaceOnUse">
          <stop stopColor="#d9d2ff" />
          <stop offset="0.5" stopColor="#8f7cff" />
          <stop offset="1" stopColor="#d896c8" />
        </linearGradient>
      </defs>
      {rungs.map((i) => {
        const t = i / (rungs.length - 1);
        const y = 30 + t * 500;
        const phase = t * Math.PI * 3;
        const x1 = 260 + Math.sin(phase) * 150;
        const x2 = 260 - Math.sin(phase) * 150;
        const colors = ["#5e6ad2", "#8f7cff", "#d896c8", "#7cc4e8"];
        return (
          <g key={i}>
            <line x1={x1} y1={y} x2={x2} y2={y} stroke={colors[i % 4]} strokeWidth="10" strokeLinecap="round" opacity="0.9" />
            <circle cx={x1} cy={y} r="13" fill="#ece8f8" />
            <circle cx={x2} cy={y} r="13" fill="#ece8f8" />
          </g>
        );
      })}
      <path d={`M ${260 + Math.sin(0) * 150} 30 ${rungs.map((i) => { const t = i / (rungs.length - 1); return `L ${260 + Math.sin(t * Math.PI * 3) * 150} ${30 + t * 500}`; }).join(" ")}`} stroke="url(#g)" strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.9" />
      <path d={`M ${260 - Math.sin(0) * 150} 30 ${rungs.map((i) => { const t = i / (rungs.length - 1); return `L ${260 - Math.sin(t * Math.PI * 3) * 150} ${30 + t * 500}`; }).join(" ")}`} stroke="url(#g)" strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.9" />
    </svg>
  );
}

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "radial-gradient(ellipse at 75% 50%, rgba(143,124,255,0.18), #0a0a14 60%)",
          color: "#e9e4f5",
          fontFamily: "Inter, system-ui, sans-serif",
          padding: "72px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 620 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 26, fontWeight: 700, marginBottom: 36 }}>
            <div style={{ width: 14, height: 14, borderRadius: 999, background: "#8f7cff", boxShadow: "0 0 18px #8f7cff" }} />
            DNA Genie
          </div>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2, display: "flex", flexDirection: "column" }}>
            <span>Your genome,</span>
            <span style={{ color: "#8f7cff" }}>decoded</span>
            <span>in the browser.</span>
          </div>
          <div style={{ fontSize: 24, color: "#8c88a6", marginTop: 28, lineHeight: 1.4 }}>
            40 research-backed traits from a 23andMe or AncestryDNA file. Parsed locally — your raw DNA never touches a server.
          </div>
        </div>
        <Helix />
      </div>
    ),
    size
  );
}
