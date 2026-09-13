"use client";

import * as LucideIcons from "lucide-react";

type IconProps = { className?: string; style?: React.CSSProperties };
const ICONS = LucideIcons as unknown as Record<string, React.ComponentType<IconProps>>;

/** Renders a lucide icon by the name stored in the category metadata. */
export default function CategoryIcon({ name, ...props }: { name: string } & IconProps) {
  const Icon = ICONS[name] ?? LucideIcons.Sparkles;
  return <Icon {...props} />;
}
