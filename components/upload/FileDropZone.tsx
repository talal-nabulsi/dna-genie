"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText } from "lucide-react";

interface FileDropZoneProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export default function FileDropZone({ onFileSelected, disabled }: FileDropZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) onFileSelected(acceptedFiles[0]);
    },
    [onFileSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/plain": [".txt"], "text/csv": [".csv"] },
    maxFiles: 1,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={`glass-card p-10 sm:p-14 text-center transition-all outline-none ${
        isDragActive ? "!border-[var(--color-neon)] bg-[rgba(143,124,255,0.05)] scale-[1.01]" : ""
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer is-interactive"}`}
    >
      <input {...getInputProps()} aria-label="Choose a DNA raw data file" />
      <div className="flex justify-center mb-5">
        <div className="w-16 h-16 rounded-2xl bg-[rgba(143,124,255,0.1)] border border-[rgba(143,124,255,0.2)] flex items-center justify-center">
          {isDragActive ? <FileText className="w-7 h-7 text-[var(--color-neon)] animate-bounce" /> : <Upload className="w-7 h-7 text-[var(--color-neon)]" />}
        </div>
      </div>
      {isDragActive ? (
        <p className="text-lg font-medium text-[var(--color-neon)]">Drop it here</p>
      ) : (
        <>
          <p className="text-lg font-medium mb-1">Drag & drop your raw data file</p>
          <p className="text-sm text-[var(--color-muted)] mb-5">or click to browse</p>
          <p className="font-mono text-[11px] text-[var(--color-muted)]">.txt (23andMe) · .txt / .csv (AncestryDNA)</p>
        </>
      )}
    </div>
  );
}
