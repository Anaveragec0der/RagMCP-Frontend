"use client";

import { Terminal } from "lucide-react";

const DUMMY_LOGS = [
  { time: "14:01:02", message: "[MCP] upload_document executed" },
  { time: "14:01:03", message: "[MCP] document parsed — 12 pages extracted" },
  { time: "14:01:05", message: "[MCP] text chunking completed — 47 chunks" },
  { time: "14:01:07", message: "[MCP] embeddings generated (model: text-embedding-3-small)" },
  { time: "14:01:08", message: "[MCP] vector store updated — 47 vectors indexed" },
  { time: "14:02:15", message: "[MCP] semantic retrieval completed — top 5 chunks" },
  { time: "14:02:16", message: "[MCP] reranking applied — MMR diversity filter" },
  { time: "14:02:18", message: "[MCP] ask_knowledgebase executed — response generated" },
  { time: "14:02:19", message: "[MCP] token usage: 1,247 prompt / 384 completion" },
];

export default function LogsPanel({ logs }) {
  const displayLogs = logs || [];

  return (
    <div className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm overflow-hidden h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-800">
        <Terminal className="w-4 h-4 text-emerald-400" />
        <h2 className="text-sm font-semibold text-zinc-100 tracking-wide">
          MCP Execution Logs
        </h2>
        <span className="ml-auto text-[9px] font-bold font-mono text-emerald-500/80 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          MCP PROTOCOL ACTIVE
        </span>
      </div>

      {/* Logs */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar min-h-0 max-h-[320px]">
        {displayLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
            <Terminal className="w-8 h-8 text-zinc-700 mb-3" />
            <p className="text-xs text-zinc-500 max-w-[180px]">
              System execution logs will appear here in real-time.
            </p>
          </div>
        ) : (
          displayLogs.map((log, i) => (
            <div
              key={i}
              className="flex items-start gap-3 group hover:bg-zinc-900/50 rounded-lg px-2 py-1.5 transition-colors duration-150"
            >
              <span className="text-[11px] font-mono text-zinc-600 shrink-0 pt-0.5">
                {log.time || "00:00:00"}
              </span>
              <span className="text-[13px] font-mono text-emerald-400/90 leading-relaxed">
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
