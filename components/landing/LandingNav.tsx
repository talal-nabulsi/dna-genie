"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Github, Menu, X, ArrowUpRight } from "lucide-react";
import Logo from "@/components/layout/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { useDemo } from "@/contexts/DemoContext";

const LINKS = [
  { href: "/#explore", label: "Explore" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#traits", label: "Traits" },
  { href: "/#privacy", label: "Privacy" },
];

export const GITHUB_URL = "https://github.com/talal-nabulsi/dna-genie";

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { isDemo } = useDemo();
  const hasSession = !!user || isDemo;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${scrolled || open ? "glass-nav" : "border-b border-transparent"}`}>
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-6">
        <Logo />

        <ul className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="btn-ghost !text-sm !font-medium">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-2">
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost !p-2.5" aria-label="View source on GitHub">
            <Github className="w-[18px] h-[18px]" />
          </a>
          <Link href={hasSession ? "/dashboard" : "/auth"} className="btn-ghost !text-sm !font-medium">
            {hasSession ? "Dashboard" : "Sign in"}
          </Link>
          <Link href="/demo" className="btn-neon !py-2.5 !px-4 !text-sm">
            Try the demo <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <button className="md:hidden btn-ghost !p-2" onClick={() => setOpen((o) => !o)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden border-t border-[var(--color-glass-border)]"
          >
            <div className="px-5 py-4 flex flex-col gap-1">
              {LINKS.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="btn-ghost justify-start !text-base">
                  {l.label}
                </Link>
              ))}
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost justify-start !text-base">
                <Github className="w-4 h-4" /> GitHub
              </a>
              <div className="flex gap-2 pt-3">
                <Link href={hasSession ? "/dashboard" : "/auth"} onClick={() => setOpen(false)} className="btn-neon-outline flex-1">
                  {hasSession ? "Dashboard" : "Sign in"}
                </Link>
                <Link href="/demo" onClick={() => setOpen(false)} className="btn-neon flex-1">
                  Try the demo
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
