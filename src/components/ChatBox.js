"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import Loader from "./Loader";
import { askQuestion } from "../services/api";

export default function ChatBox({ setRetrievedChunks, setLogs }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaderText, setLoaderText] = useState("Thinking...");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend() {
    const question = input.trim();
    if (!question || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setLoading(true);

    // Animate through loader states
    setLoaderText("Thinking...");
    const loaderTimer1 = setTimeout(() => setLoaderText("Generating embeddings..."), 600);
    const loaderTimer2 = setTimeout(() => setLoaderText("Retrieving context..."), 1400);
    const loaderTimer3 = setTimeout(() => setLoaderText("Generating response..."), 2200);

    try {
      // Call real backend API
      const data = await askQuestion(question);

      clearTimeout(loaderTimer1);
      clearTimeout(loaderTimer2);
      clearTimeout(loaderTimer3);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer },
      ]);

      if (setRetrievedChunks && data.retrievedChunks) {
        setRetrievedChunks(data.retrievedChunks);
      }
      if (setLogs && data.logs) {
        setLogs((prev) => [...prev, ...data.logs]);
      }
    } catch (error) {
      clearTimeout(loaderTimer1);
      clearTimeout(loaderTimer2);
      clearTimeout(loaderTimer3);

      const errorMsg =
        error.response?.data?.error ||
        error.message ||
        "Failed to get a response. Make sure the backend is running.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `⚠️ ${errorMsg}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm overflow-hidden h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-800">
        <Sparkles className="w-4 h-4 text-violet-400" />
        <h2 className="text-sm font-semibold text-zinc-100 tracking-wide">
          Ask your Documents
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar min-h-0 max-h-[420px]">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-12 text-center animate-fadeIn">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-sky-500/20 flex items-center justify-center mb-4">
              <Bot className="w-7 h-7 text-violet-400" />
            </div>
            <p className="text-sm text-zinc-400 max-w-[240px]">
              Upload a document and ask questions. AI will retrieve relevant context and generate answers.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 animate-fadeIn ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4 text-violet-400" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-violet-600 text-white rounded-br-md"
                  : "bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-bl-md"
              }`}
            >
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4 text-zinc-400" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 animate-fadeIn">
            <div className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0 mt-0.5">
              <Bot className="w-4 h-4 text-violet-400" />
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl rounded-bl-md px-2 py-1">
              <Loader text={loaderText} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-zinc-800 p-4">
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 focus-within:border-violet-500/50 transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about your document..."
            className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-600 outline-none"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-800 disabled:text-zinc-600 flex items-center justify-center transition-all duration-200 text-white shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
