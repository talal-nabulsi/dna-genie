"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { clearSession } from "@/lib/session/store";
import { useSession } from "@/lib/session/useReport";
import { Mark } from "./Brand";

const APP = [
  { href: "/dashboard", label: "Report" },
  { href: "/upload", label: "DNA file" },
  { href: "/blood", label: "Blood test" },
  { href: "/explore", label: "Genome map" },
  { href: "/summary", label: "Visit summary" },
];
const SITE = [
  { href: "/#markers", label: "Markers" },
  { href: "/#blood", label: "Blood tests" },
  { href: "/#privacy", label: "Privacy" },
  { href: "/explore", label: "Genome map" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const session = useSession();
  const active = !!user || session.demo || !!session.genome || !!session.labs;
  const links = path === "/" || !active ? SITE : APP;
  const sample = !user && session.demo && !session.genome && path !== "/";

  const leave = async () => {
    setOpen(false);
    if (user) await signOut(); else clearSession();
    router.push("/");
  };

  return (
    <>
      {sample && (
        <div className="notice"><div className="wrap in">
          <strong>Sample report</strong><span>The DNA and blood values are made up.</span>
          <Link href="/upload" className="link">Use your own file</Link>
        </div></div>
      )}
      <header className="bar">
        <div className="wrap in">
          <Link href="/" className="brand"><Mark /> DNA Genie</Link>
          <button className="menu-btn" aria-expanded={open} aria-controls="nav" onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}</button>
          <nav id="nav" className="nav" data-open={open} aria-label="Main">
            {links.map((l) => <Link key={l.href} href={l.href} aria-current={path === l.href ? "page" : undefined} onClick={() => setOpen(false)}>{l.label}</Link>)}
            {path === "/" && active && <Link href="/dashboard" onClick={() => setOpen(false)}>Your report</Link>}
            {user ? <button onClick={leave}>Sign out</button> : active && path !== "/" ? <button onClick={leave}>Clear and leave</button> : <Link href="/auth" onClick={() => setOpen(false)}>Sign in</Link>}
          </nav>
        </div>
      </header>
    </>
  );
}
