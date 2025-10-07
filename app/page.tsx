'use client'

import { useRef, useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function acceptFile(f: File) {
    setError(null);
    setMessage(null);
    if (!f) return;
    const name = f.name.toLowerCase();
    const isXlsx = name.endsWith('.xlsx') || f.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const isXls = name.endsWith('.xls') || f.type === 'application/vnd.ms-excel';
    if (!isXlsx && !isXls) {
      setError("Please upload an Excel spreadsheet (.xlsx or .xls).");
      setFile(null);
      return;
    }
    setFile(f);

    console.log("[XLSX] File received:", {
      name: f.name,
      type: f.type,
      size_bytes: f.size
    });
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) acceptFile(f);
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function onDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) acceptFile(f);
  }

  function openFileDialog() {
    inputRef.current?.click();
  }

  async function onContinue() {
    if (!file) {
      setError("Please select a spreadsheet first.");
      return;
    }
    setError(null);
    setMessage(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Upload failed");

      console.log("[XLSX] Upload OK:", data);
      setMessage("Spreadsheet uploaded successfully.");
    } catch (e: any) {
      console.error("[XLSX] Upload error:", e);
      setError(String(e.message || e));
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="min-h-dvh flex flex-col">
      <header className="border-b bg-white/70 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="size-8 rounded bg-black text-white grid place-items-center font-bold">INL</div>
          <div className="font-semibold text-lg">Idaho National Laboratory</div>
        </div>
      </header>

      <section className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="text-2xl font-semibold mb-4">Upload your spreadsheet</h1>
          <p className="text-sm text-gray-500 mb-6">Drop a .xlsx/.xls file here or browse from your device.</p>

          <div
            onDragOver={onDragOver}
            onDragEnter={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`rounded-lg border-2 border-dashed p-8 transition-colors ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
          >
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="text-gray-500">Drag and drop your .xlsx/.xls here</div>
              <div className="text-gray-400 text-sm">or</div>
              <button
                type="button"
                onClick={openFileDialog}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Browse file
              </button>
              <input
                ref={inputRef}
                type="file"
                accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                onChange={onInputChange}
                className="hidden"
              />
            </div>
          </div>

          {file && (
            <div className="mt-4 rounded border p-4 bg-white/50">
              <div className="text-sm">
                Selected file: <span className="font-medium">{file.name}</span> ({Math.round(file.size / 1024)} KB)
              </div>
              <div className="mt-3 flex gap-2">
                <button type="button" className="px-3 py-1 text-sm rounded border" onClick={() => setFile(null)}>Remove</button>
                <button
                  type="button"
                  onClick={onContinue}
                  disabled={uploading}
                  className={`px-3 py-1 text-sm rounded ${uploading ? "bg-gray-300 text-gray-600" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                >
                  {uploading ? "Uploading..." : "Continue"}
                </button>
              </div>
              {message && <div className="mt-2 text-sm text-green-600">{message}</div>}
            </div>
          )}

          {error && (
            <div className="mt-4 text-sm text-red-600">{error}</div>
          )}
        </div>
      </section>
    </main>
  );
}