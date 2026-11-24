"use client";

import { useRef, useState } from "react";

export default function Drop({ accept, onFile, title, hint, disabled }: { accept: string; onFile: (f: File) => void; title: string; hint: string; disabled?: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  return (
    <>
      <button type="button" className="drop" data-over={over} disabled={disabled}
        onClick={() => input.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); const f = e.dataTransfer.files[0]; if (f && !disabled) onFile(f); }}>
        <b>{over ? "Drop it here" : title}</b><span className="muted">{hint}</span>
      </button>
      <input ref={input} type="file" hidden accept={accept} data-testid="file" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ""; }} />
    </>
  );
}
