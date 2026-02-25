"use client";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
}

export default function LoadingSpinner({ size = "md" }: LoadingSpinnerProps) {
  const sizeClass = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-3",
  }[size];

  return (
    <div
      className={`${sizeClass} border-[var(--color-glass-border)] border-t-[var(--color-neon)] rounded-full animate-spin`}
    />
  );
}
