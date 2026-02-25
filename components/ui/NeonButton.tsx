"use client";

import { ReactNode } from "react";

interface NeonButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "filled" | "outline";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}

export default function NeonButton({
  children,
  onClick,
  variant = "filled",
  className = "",
  disabled = false,
  type = "button",
}: NeonButtonProps) {
  const base = variant === "filled" ? "btn-neon" : "btn-neon-outline";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {children}
    </button>
  );
}
