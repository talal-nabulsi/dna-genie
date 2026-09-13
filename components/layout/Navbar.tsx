"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useDemo } from "@/contexts/DemoContext";
import Logo from "./Logo";
import { Upload, LayoutDashboard, LogOut, Orbit, FlaskConical, LogIn } from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/explore", label: "Explore", icon: Orbit },
  { href: "/upload", label: "Upload", icon: Upload },
];

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { isDemo, exitDemo } = useDemo();
  const pathname = usePathname();

  return (
    <nav className="glass-nav sticky top-0 z-50 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Logo />
          <ul className="hidden sm:flex items-center gap-1">
            {NAV.map((n) => {
              const active = pathname?.startsWith(n.href);
              return (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className={`btn-ghost !text-sm !font-medium ${active ? "!text-[var(--color-foreground)] !bg-white/[0.06]" : ""}`}
                  >
                    <n.icon className="w-4 h-4" />
                    {n.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden md:inline text-xs text-[var(--color-muted)] max-w-[180px] truncate">{user.email}</span>
              <button onClick={signOut} className="btn-ghost !text-sm">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </>
          ) : isDemo ? (
            <>
              <span className="pill !border-[rgba(143,124,255,0.35)] !text-[var(--color-foreground)]">
                <FlaskConical className="w-3.5 h-3.5 text-[var(--color-neon)]" />
                <span className="hidden sm:inline">Sample genome</span>
                <span className="sm:hidden">Demo</span>
              </span>
              <Link href="/auth" onClick={exitDemo} className="btn-neon !py-2 !px-3.5 !text-sm">
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Sign in</span>
              </Link>
            </>
          ) : null}
        </div>
      </div>

      {/* Mobile tab bar */}
      <ul className="sm:hidden flex items-center justify-around border-t border-[var(--color-glass-border)] -mx-4 px-2 h-11">
        {NAV.map((n) => {
          const active = pathname?.startsWith(n.href);
          return (
            <li key={n.href} className="flex-1">
              <Link href={n.href} className={`flex items-center justify-center gap-1.5 text-xs h-11 ${active ? "text-[var(--color-neon)]" : "text-[var(--color-muted)]"}`}>
                <n.icon className="w-4 h-4" /> {n.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
