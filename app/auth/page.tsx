"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { update } from "@/lib/session/store";

const SAY: Record<string, string> = {
  "auth/invalid-credential": "That email and password do not match an account.",
  "auth/email-already-in-use": "There is already an account with that email. Sign in instead.",
  "auth/weak-password": "Use at least 6 characters.",
  "auth/popup-closed-by-user": "The Google window was closed before you finished.",
  "auth/popup-blocked": "Your browser blocked the Google window. Allow pop-ups and try again.",
  "auth/too-many-requests": "Too many tries. Wait a few minutes.",
  "auth/network-request-failed": "No connection. Check your network and try again.",
};

export default function AuthPage() {
  const [create, setCreate] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const router = useRouter();

  const run = async (fn: () => Promise<void>) => {
    setErr(""); setBusy(true);
    try { await fn(); update({ demo: false }); router.push("/dashboard"); }
    catch (e) { setErr(SAY[(e as { code?: string }).code ?? ""] ?? "That did not work. Try again."); }
    finally { setBusy(false); }
  };

  return (
    <>
      <Header />
      <main id="main" className="appmin">
        <div className="wrap">
          <div className="ptitle"><h1>{create ? "Create an account" : "Sign in"}</h1></div>
          <div className="two">
            <div style={{ maxWidth: 460, display: "grid", gap: 20 }}>
              <button className="btn" disabled={busy} onClick={() => run(signInWithGoogle)}>Continue with Google</button>
              <form style={{ display: "grid", gap: 18 }} onSubmit={(e) => { e.preventDefault(); run(() => (create ? signUpWithEmail(email, password) : signInWithEmail(email, password))); }}>
                <label className="field"><span>Email</span><input className="input" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
                <label className="field"><span>Password</span><input className="input" type="password" required minLength={6} autoComplete={create ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} /></label>
                {err && <p className="err" role="alert">{err}</p>}
                <button className="btn fill" disabled={busy}>{busy ? "One moment" : create ? "Create account" : "Sign in"}</button>
              </form>
              <p><button className="link" onClick={() => { setCreate(!create); setErr(""); }}>{create ? "I already have an account" : "Create an account"}</button></p>
            </div>
            <aside style={{ display: "grid", gap: 22 }}>
              <section><h2 style={{ fontSize: "1.25rem", marginBottom: 8 }}>You do not need an account</h2><p className="muted">Everything works without one. An account only lets you come back to your genotypes later, and to a blood test if you choose to save it.</p></section>
              <div className="row"><Link className="btn" href="/upload">Continue without one</Link></div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
