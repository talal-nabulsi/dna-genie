import type { Judged } from "@/lib/labs/panel";

export default function Urgent({ judged, date }: { judged: Judged[]; date?: string }) {
  const u = judged.filter((j) => j.urgent);
  if (!u.length) return null;
  return (
    <div className="urgent" role="alert">
      <h2>Call your clinician today</h2>
      <p>{u.map((j) => `${j.marker.name} ${j.bound ?? ""}${j.value} ${j.marker.unit}`).join(", ")}{date ? `, from ${date},` : ""} {u.length > 1 ? "are" : "is"} far enough outside the usual range to raise the same day. If the numbers were typed or read wrongly, correct them first. If you feel unwell, seek urgent care.</p>
    </div>
  );
}
