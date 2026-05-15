"use client";

import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, X } from "lucide-react";
import { uploadDocument } from "../services/api";

export default function UploadBox({ setLogs, onUploadSuccess }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [fileName, setFileName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef(null);

  function handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type === "application/pdf") {
      handleUpload(file);
    } else {
      setStatus("error");
      setErrorMsg("Only PDF files are supported");
      setTimeout(() => setStatus(null), 3000);
    }
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  }

  async function handleUpload(file) {
    setFileName(file.name);
    setUploading(true);
    setProgress(0);
    setStatus(null);
    setErrorMsg("");

    // Simulate progress while real upload happens
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 8 + 3;
      if (prog > 90) prog = 90; // Cap at 90% until real response
      setProgress(prog);
    }, 400);

    try {
      // Call real backend API
      const data = await uploadDocument(file);

      clearInterval(interval);
      setProgress(100);
      setUploading(false);
      setStatus("success");

      // Add real logs from backend
      if (setLogs && data.logs) {
        setLogs((prev) => [...prev, ...data.logs]);
      }

      if (onUploadSuccess) {
        onUploadSuccess(file.name);
      }
    } catch (error) {
      clearInterval(interval);
      setUploading(false);
      setStatus("error");
      setErrorMsg(error.response?.data?.error || error.message || "Upload failed");
    }
  }

  function resetUpload() {
    setStatus(null);
    setFileName("");
    setProgress(0);
    setErrorMsg("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-800">
        <Upload className="w-4 h-4 text-violet-400" />
        <h2 className="text-sm font-semibold text-zinc-100 tracking-wide">
          Upload Document
        </h2>
      </div>

      {/* Upload Area */}
      <div className="p-5">
        {status === "success" ? (
          <div className="flex flex-col items-center gap-3 py-6 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-100">Upload Complete</p>
              <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1.5 justify-center">
                <FileText className="w-3.5 h-3.5" />
                {fileName}
              </p>
            </div>
            <button
              onClick={resetUpload}
              className="mt-2 text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors"
            >
              <X className="w-3 h-3" /> Upload another
            </button>
          </div>
        ) : status === "error" ? (
          <div className="flex flex-col items-center gap-3 py-6 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <p className="text-sm text-red-400">{errorMsg || "Upload failed"}</p>
            <button
              onClick={resetUpload}
              className="mt-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Try again
            </button>
          </div>
        ) : (
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => !uploading && inputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center gap-3 py-8 px-4 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
              ${dragActive
                ? "border-violet-500 bg-violet-500/5"
                : "border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/50"
              }
              ${uploading ? "pointer-events-none" : ""}
            `}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {uploading ? (
              <div className="flex flex-col items-center gap-3 w-full">
                <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center animate-pulse">
                  <FileText className="w-5 h-5 text-violet-400" />
                </div>
                <p className="text-sm text-zinc-300">{fileName}</p>
                <div className="w-full max-w-[200px] h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-sky-500 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-zinc-500">Processing document...</p>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                  <Upload className="w-5 h-5 text-zinc-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-zinc-300">
                    Drop your PDF here or{" "}
                    <span className="text-violet-400 font-medium">browse</span>
                  </p>
                  <p className="text-xs text-zinc-600 mt-1">PDF files only • Max 20MB</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
