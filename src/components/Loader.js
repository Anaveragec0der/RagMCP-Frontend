"use client";

export default function Loader({ text = "Thinking..." }) {
  return (
    <div className="flex items-center gap-3 py-3 px-4">
      <div className="flex items-center gap-1.5">
        <span
          className="inline-block w-2 h-2 rounded-full bg-violet-500 animate-bounce"
          style={{ animationDelay: "0ms", animationDuration: "0.8s" }}
        />
        <span
          className="inline-block w-2 h-2 rounded-full bg-violet-400 animate-bounce"
          style={{ animationDelay: "150ms", animationDuration: "0.8s" }}
        />
        <span
          className="inline-block w-2 h-2 rounded-full bg-violet-300 animate-bounce"
          style={{ animationDelay: "300ms", animationDuration: "0.8s" }}
        />
      </div>
      <span className="text-sm text-zinc-400 animate-pulse">{text}</span>
    </div>
  );
}
