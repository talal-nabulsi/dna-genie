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
      if (acceptedFiles.length > 0) {
        onFileSelected(acceptedFiles[0]);
      }
    },
    [onFileSelected]
  );

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".txt"],
      "text/csv": [".csv"],
    },
    maxFiles: 1,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        glass-card p-12 text-center cursor-pointer transition-all
        ${isDragActive ? "border-[var(--color-neon)] bg-[var(--color-neon)]/5 scale-[1.01]" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-[var(--color-glass-hover)]"}
      `}
    >
      <input {...getInputProps()} />

      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-neon)]/10 flex items-center justify-center">
          {isDragActive ? (
            <FileText className="w-8 h-8 text-[var(--color-neon)] animate-bounce" />
          ) : (
            <Upload className="w-8 h-8 text-[var(--color-neon)]" />
          )}
        </div>
      </div>

      {isDragActive ? (
        <p className="text-lg font-medium text-[var(--color-neon)]">
          Drop your DNA file here...
        </p>
      ) : (
        <>
          <p className="text-lg font-medium mb-2">
            Drag & drop your DNA file here
          </p>
          <p className="text-sm text-[var(--color-muted)] mb-4">
            or click to browse
          </p>
          <p className="text-xs text-[var(--color-muted)]">
            Supports 23andMe (.txt) and AncestryDNA (.txt, .csv)
          </p>
        </>
      )}
    </div>
  );
}
