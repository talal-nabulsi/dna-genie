"use client";

import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  onClick,
  hoverable = true,
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`glass-card p-5 ${hoverable ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
