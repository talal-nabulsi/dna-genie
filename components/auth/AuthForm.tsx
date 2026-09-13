"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, FlaskConical } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useDemo } from "@/contexts/DemoContext";
import Logo from "@/components/layout/Logo";

const HeroHelix = dynamic(() => import("@/components/three/HeroHelix"), { ssr: false });

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.3-1.6 3.7-5.4 3.7-3.3 0-5.9-2.7-5.9-6s2.6-6 5.9-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.2 14.6 2.2 12 2.2 6.6 2.2 2.2 6.6 2.2 12S6.6 21.8 12 21.8c5.7 0 9.4-4 9.4-9.6 0-.6-.1-1.1-.2-1.6H12z" />
    </svg>
  );
}

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const { exitDemo } = useDemo();
  const router = useRouter();

  const clean = (m: string) => m.replace("Firebase: ", "").replace(/\(auth\/.*\)/, "").trim();

  const run = async (fn: () => Promise<void>) => {
    setError("");
    setLoading(true);
    try {
      await fn();
      exitDemo();
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(clean(err instanceof Error ? err.message : "Authentication failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[var(--color-background)]">
      <div className="relative flex flex-col px-6 py-8 sm:px-12">
        <div className="flex items-center justify-between">
          <Logo />
          <Link href="/" className="btn-ghost !text-sm">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center py-12">
          <div className="w-full max-w-sm">
            <h1 className="text-3xl font-bold mb-2">{isSignUp ? "Create your account" : "Welcome back"}</h1>
            <p className="text-sm text-[var(--color-muted)] mb-8">
              {isSignUp ? "Save your 44 trait genotypes — never the raw file." : "Sign in to see your saved traits."}
            </p>

            <button
              onClick={() => run(signInWithGoogle)}
              disabled={loading}
              className="btn-neon-outline w-full !py-3 mb-5"
            >
              <GoogleIcon /> Continue with Google
            </button>

            <div className="flex items-center gap-4 mb-5">
              <div className="flex-1 h-px bg-[var(--color-glass-border)]" />
              <span className="text-xs text-[var(--color-muted)]">or with email</span>
              <div className="flex-1 h-px bg-[var(--color-glass-border)]" />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                run(() => (isSignUp ? signUpWithEmail(email, password) : signInWithEmail(email, password)));
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="email" className="block text-sm text-[var(--color-muted)] mb-1.5">Email</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input" placeholder="you@example.com" autoComplete="email" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm text-[var(--color-muted)] mb-1.5">Password</label>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="input" placeholder="At least 6 characters" autoComplete={isSignUp ? "new-password" : "current-password"} />
              </div>
              {error && <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 px-4 py-2.5 rounded-xl">{error}</p>}
              <button type="submit" disabled={loading} className="btn-neon w-full !py-3">
                {loading ? "One moment…" : isSignUp ? "Create account" : "Sign in"}
              </button>
            </form>

            <p className="text-sm text-center text-[var(--color-muted)] mt-6">
              {isSignUp ? "Already have an account?" : "New here?"}{" "}
              <button onClick={() => { setIsSignUp(!isSignUp); setError(""); }} className="text-[var(--color-neon)] hover:underline font-medium">
                {isSignUp ? "Sign in" : "Create an account"}
              </button>
            </p>

            <Link href="/demo" className="mt-8 flex items-center justify-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors">
              <FlaskConical className="w-4 h-4" /> Or explore the sample genome without an account
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden lg:block relative overflow-hidden border-l border-[var(--color-glass-border)] noise">
        <div className="absolute inset-0 surface-grid" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(57,255,20,0.14),transparent_60%)]" />
        <HeroHelix className="absolute inset-0" />
        <div className="absolute bottom-10 left-10 right-10">
          <p className="text-2xl font-semibold max-w-sm">“Only 44 of my 600,000 markers ever left the browser.”</p>
          <p className="text-sm text-[var(--color-muted)] mt-2">That&apos;s the whole design.</p>
        </div>
      </div>
    </div>
  );
}
