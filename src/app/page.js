"use client";

import { useState } from "react";
import UploadBox from "../components/UploadBox";
import ChatBox from "../components/ChatBox";
import RetrievalPanel from "../components/RetrievalPanel";
import LogsPanel from "../components/LogsPanel";
import { Cpu } from "lucide-react";

export default function Home() {
  const [logs, setLogs] = useState([]);
  const [retrievedChunks, setRetrievedChunks] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="relative border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-50">
        {/* Subtle gradient line at top */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-sky-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-zinc-100 tracking-tight">
                RAG MCP Demo
              </h1>
              <p className="text-xs text-zinc-500">
                Real MCP Server + Semantic Retrieval
              </p>
            </div>

            {/* Status indicator */}
            {uploadedFile && (
              <div className="ml-auto hidden sm:flex items-center gap-2 text-xs text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{uploadedFile}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 h-full">
          {/* Left Column */}
          <div className="flex flex-col gap-5">
            <UploadBox
              setLogs={setLogs}
              onUploadSuccess={(name) => setUploadedFile(name)}
            />
            <div className="flex-1 min-h-[400px]">
              <ChatBox
                setRetrievedChunks={setRetrievedChunks}
                setLogs={setLogs}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-5">
            <RetrievalPanel chunks={retrievedChunks} />
            <LogsPanel logs={logs} />
          </div>
        </div>
      </main>

    </div>
  );
}
