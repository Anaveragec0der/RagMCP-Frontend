"use client";

import { Layers } from "lucide-react";

const DUMMY_CHUNKS = [
  {
    id: 1,
    score: 0.94,
    text: "Employees are entitled to 12 paid leaves annually. Unused leaves can be carried forward to the next fiscal year, up to a maximum of 5 days.",
  },
  {
    id: 2,
    score: 0.89,
    text: "The company provides health insurance coverage for all full-time employees and their immediate dependents, effective from the date of joining.",
  },
  {
    id: 3,
    score: 0.82,
    text: "Performance reviews are conducted bi-annually. Employees are evaluated on key result areas (KRAs) and organizational contribution metrics.",
  },
  {
    id: 4,
    score: 0.76,
    text: "Remote work policy allows employees to work from home up to 3 days per week, subject to manager approval and project requirements.",
  },
  {
    id: 5,
    score: 0.71,
    text: "The notice period for resignation is 30 days for all employees below the director level. Early release may be granted at the discretion of the reporting manager.",
  },
];

function getScoreColor(score) {
  if (score >= 0.9) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  if (score >= 0.8) return "text-sky-400 bg-sky-500/10 border-sky-500/20";
  if (score >= 0.7) return "text-amber-400 bg-amber-500/10 border-amber-500/20";
  return "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";
}

function getScoreBarWidth(score) {
  return `${Math.round(score * 100)}%`;
}

export default function RetrievalPanel({ chunks }) {
  const displayChunks = chunks || [];

  return (
    <div className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm overflow-hidden h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-800">
        <Layers className="w-4 h-4 text-violet-400" />
        <h2 className="text-sm font-semibold text-zinc-100 tracking-wide">
          Retrieved Context
        </h2>
        <span className="ml-auto text-[11px] text-zinc-500">
          {displayChunks.length} chunks
        </span>
      </div>

      {/* Chunks */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar min-h-0 max-h-[400px]">
        {displayChunks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
            <Layers className="w-8 h-8 text-zinc-700 mb-3" />
            <p className="text-xs text-zinc-500 max-w-[180px]">
              Relevant document sections will appear here after you ask a question.
            </p>
          </div>
        ) : (
          displayChunks.map((chunk, i) => (
            <div
              key={chunk.id || i}
              className="group rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4 hover:border-zinc-700 hover:bg-zinc-900/80 transition-all duration-200"
            >
              {/* Chunk header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                  Chunk #{chunk.chunkIndex !== undefined ? chunk.chunkIndex : (chunk.id || i + 1)}
                </span>
                <span
                  className={`text-[11px] font-semibold font-mono px-2.5 py-1 rounded-full border ${getScoreColor(chunk.score)}`}
                >
                  {(chunk.score * 100).toFixed(0)}% match
                </span>
              </div>

              {/* Score bar */}
              <div className="w-full h-1 rounded-full bg-zinc-800 mb-3 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-sky-500 transition-all duration-500"
                  style={{ width: getScoreBarWidth(chunk.score) }}
                />
              </div>

              {/* Chunk text */}
              <p className="text-[13px] text-zinc-400 leading-relaxed">
                {chunk.text}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
