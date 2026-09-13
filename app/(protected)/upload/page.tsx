"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Info, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useDemo } from "@/contexts/DemoContext";
import { parseDNAFile } from "@/lib/dna/parser";
import { saveSNPResults } from "@/lib/firebase/firestore";
import { ParseProgress } from "@/lib/dna/types";
import { ALL_REQUIRED_RSIDS, ALL_TRAITS } from "@/lib/traits/traitDatabase";
import FileDropZone from "@/components/upload/FileDropZone";
import ParsingProgress from "@/components/upload/ParsingProgress";
import ParseResults from "@/components/upload/ParseResults";

export default function UploadPage() {
  const { user } = useAuth();
  const { setLocalGenome, exitDemo } = useDemo();
  const [progress, setProgress] = useState<ParseProgress | null>(null);
  const [result, setResult] = useState<{ snpCount: number; format: string; saved: boolean } | null>(null);
  const [parsing, setParsing] = useState(false);

  const handleFileSelected = async (file: File) => {
    setParsing(true);
    setResult(null);
    try {
      const parsed = await parseDNAFile(file, setProgress);
      if (user) {
        await saveSNPResults(user.uid, parsed.snps, parsed.format);
      } else {
        setLocalGenome(parsed.snps, parsed.format);
      }
      setResult({ snpCount: parsed.snpsFound, format: parsed.format, saved: !!user });
    } catch (err) {
      console.error("Parse error:", err);
    } finally {
      setParsing(false);
    }
  };

  const reset = () => { setProgress(null); setResult(null); };

  return (
    <div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_320px] gap-8 items-start">
      <div>
        <div className="mb-8">
          <p className="eyebrow mb-2">Upload</p>
          <h1 className="text-3xl sm:text-4xl font-bold">Read your raw DNA file</h1>
          <p className="text-[var(--color-muted)] mt-2">
            23andMe or AncestryDNA exports. {user ? "Results are saved to your account." : "In demo mode, results stay in this tab and are never saved."}
          </p>
        </div>

        <div className="space-y-6">
          {!result && <FileDropZone onFileSelected={handleFileSelected} disabled={parsing} />}
          {progress && !result && <ParsingProgress progress={progress} />}
          {result && <ParseResults snpCount={result.snpCount} format={result.format} saved={result.saved} onReset={reset} />}
        </div>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-20">
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-[var(--color-neon)]" />
            <h2 className="font-semibold text-sm">What happens to the file</h2>
          </div>
          <ul className="space-y-2.5 text-sm text-[var(--color-muted)] leading-relaxed">
            <li>Read with the browser File API, parsed in 10,000-line chunks.</li>
            <li>
              Only <span className="text-[var(--color-foreground)] tabular-nums">{ALL_REQUIRED_RSIDS.size}</span> markers across{" "}
              <span className="text-[var(--color-foreground)] tabular-nums">{ALL_TRAITS.length}</span> traits are kept.
            </li>
            <li>{user ? "Those genotypes are written to your Firestore document — nothing else." : "Nothing is sent anywhere. Close the tab and it's gone."}</li>
          </ul>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-[var(--color-neon)]" />
            <h2 className="font-semibold text-sm">Where to get the file</h2>
          </div>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="https://you.23andme.com/tools/data/download/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors">
                23andMe → Browse raw data → Download ↗
              </a>
            </li>
            <li>
              <a href="https://www.ancestry.com/dna/settings" target="_blank" rel="noopener noreferrer" className="text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors">
                AncestryDNA → Settings → Download DNA data ↗
              </a>
            </li>
          </ul>
        </div>

        {!user && (
          <Link href="/auth" onClick={exitDemo} className="btn-neon-outline w-full !text-sm">
            <LogIn className="w-4 h-4" /> Sign in to keep results
          </Link>
        )}
      </aside>
    </div>
  );
}
