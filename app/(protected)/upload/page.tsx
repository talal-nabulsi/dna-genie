"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { parseDNAFile } from "@/lib/dna/parser";
import { saveSNPResults } from "@/lib/firebase/firestore";
import { ParseProgress } from "@/lib/dna/types";
import FileDropZone from "@/components/upload/FileDropZone";
import ParsingProgress from "@/components/upload/ParsingProgress";
import ParseResults from "@/components/upload/ParseResults";
import { Shield } from "lucide-react";

export default function UploadPage() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ParseProgress | null>(null);
  const [result, setResult] = useState<{
    snpCount: number;
    format: string;
    saved: boolean;
  } | null>(null);
  const [parsing, setParsing] = useState(false);

  const handleFileSelected = async (file: File) => {
    if (!user) return;

    setParsing(true);
    setResult(null);

    try {
      const parseResult = await parseDNAFile(file, setProgress);

      // Save to Firestore
      await saveSNPResults(user.uid, parseResult.snps, parseResult.format);

      setResult({
        snpCount: parseResult.snpsFound,
        format: parseResult.format,
        saved: true,
      });
    } catch (err) {
      console.error("Parse error:", err);
    } finally {
      setParsing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Upload DNA File</h1>
        <p className="text-[var(--color-muted)]">
          Upload your 23andMe or AncestryDNA raw data file
        </p>
      </div>

      {/* Privacy notice */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--color-neon)]/5 border border-[var(--color-neon)]/10 mb-8">
        <Shield className="w-5 h-5 text-[var(--color-neon)] shrink-0 mt-0.5" />
        <div className="text-sm text-[var(--color-foreground)]/70">
          <strong className="text-[var(--color-neon)]">Privacy first:</strong> Your DNA file is
          parsed entirely in your browser. Only ~150 trait-relevant SNPs (out of 600,000+) are
          stored in your account. The raw file never leaves your device.
        </div>
      </div>

      <div className="space-y-6">
        {!result && <FileDropZone onFileSelected={handleFileSelected} disabled={parsing} />}

        {progress && !result && <ParsingProgress progress={progress} />}

        {result && (
          <ParseResults
            snpCount={result.snpCount}
            format={result.format}
            saved={result.saved}
          />
        )}
      </div>
    </div>
  );
}
