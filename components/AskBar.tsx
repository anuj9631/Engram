"use client";
import { useState } from "react";

type Source = {
  id: string;
  title: string | null;
  content: string;
  similarity: number;
  created_at: string;
};

const HINTS = [
  "What are my best project ideas?",
  "What do I know about machine learning?",
  "What are my goals this year?",
  "What did I learn recently?",
];

export default function AskBar({ userId }: { userId: string }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [asked, setAsked] = useState(false);

  const ask = async (q?: string) => {
    const query = (q ?? question).trim();
    if (!query) return;
    setQuestion(query);
    setLoading(true);
    setError("");
    setAsked(true);
    setAnswer("");
    setSources([]);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": userId },
        body: JSON.stringify({ question: query }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAnswer(data.answer);
      setSources(data.sources);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm overflow-hidden">
      {/* Purple header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="text-lg">✨</span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Ask your memory</h2>
            <p className="text-xs text-violet-200">Powered by your own notes</p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Input row */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && ask()}
              placeholder="Ask anything about your notes…"
              className="w-full text-sm border-2 border-gray-100 focus:border-violet-300 rounded-2xl px-4 py-3 focus:outline-none transition-colors placeholder:text-gray-300 pr-10"
            />
            {question && (
              <button
                onClick={() => setQuestion("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
              >
                ✕
              </button>
            )}
          </div>
          <button
            onClick={() => ask()}
            disabled={!question.trim() || loading}
            className="btn-primary text-white font-bold px-5 py-3 rounded-2xl disabled:opacity-30 whitespace-nowrap"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              "Ask →"
            )}
          </button>
        </div>

        {/* Hint buttons */}
        {!asked && (
          <div className="flex flex-wrap gap-2 mt-3">
            {HINTS.map((h) => (
              <button
                key={h}
                onClick={() => ask(h)}
                className="text-xs text-violet-500 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-full transition-colors border border-violet-100 font-medium"
              >
                {h}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-5 flex items-center gap-3 p-4 bg-violet-50 rounded-2xl border border-violet-100">
            <div className="w-5 h-5 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin shrink-0" />
            <div>
              <p className="text-sm font-medium text-violet-700">
                Searching your memories…
              </p>
              <p className="text-xs text-violet-400">
                Finding relevant context
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600">
            ⚠ {error}
          </div>
        )}

        {/* Answer */}
        {answer && !loading && (
          <div className="mt-5 space-y-3">
            <div className="relative bg-gradient-to-br from-violet-50 to-pink-50 border border-violet-100 rounded-2xl p-5">
              <div className="absolute -top-3 left-5 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                ✨ Engram
              </div>
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap mt-1">
                {answer}
              </p>
            </div>

            {/* Sources */}
            {sources.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Based on {sources.length} memor
                  {sources.length === 1 ? "y" : "ies"}
                </p>
                <div className="space-y-2">
                  {sources.map((src) => (
                    <div
                      key={src.id}
                      className="flex gap-3 bg-gray-50 rounded-2xl p-3 border border-gray-100 hover:border-violet-200 transition-colors"
                    >
                      <div
                        className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black text-white bg-gradient-to-br ${
                          src.similarity >= 80
                            ? "from-violet-500 to-purple-600"
                            : src.similarity >= 60
                              ? "from-sky-400 to-blue-500"
                              : "from-gray-400 to-gray-500"
                        }`}
                      >
                        {src.similarity}%
                      </div>
                      <div className="min-w-0">
                        {src.title && (
                          <p className="text-xs font-bold text-gray-800 truncate">
                            {src.title}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                          {src.content}
                        </p>
                        <p className="text-xs text-gray-300 mt-1">
                          {new Date(src.created_at).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setAsked(false);
                setAnswer("");
                setSources([]);
                setQuestion("");
              }}
              className="text-xs text-violet-500 hover:text-violet-700 transition-colors font-medium"
            >
              ← Ask another question
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
