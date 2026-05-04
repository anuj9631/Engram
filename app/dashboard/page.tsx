"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import NoteInput from "@/components/NoteInput";
import AskBar from "@/components/AskBar";
import MemoryList from "@/components/MemoryList";
import MemoryAnalytics from "@/components/MemoryAnalytics";
import Onboarding from "@/components/Onboarding";
import { Memory } from "@/lib/supabase";

const USER_ID = process.env.NEXT_PUBLIC_TEST_USER_ID ?? "";
type Tab = "memories" | "ask" | "analytics";

const NAV = [
  { id: "memories", icon: "📚", label: "All memories" },
  { id: "ask", icon: "✨", label: "Ask AI" },
  { id: "analytics", icon: "📊", label: "Analytics" },
];

export default function Dashboard() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("memories");
  const [showOnboard, setShowOnboard] = useState(false);

  // Show onboarding once per device
  useEffect(() => {
    const done = localStorage.getItem("engram_onboarded");
    if (!done) setShowOnboard(true);
  }, []);

  const finishOnboarding = () => {
    localStorage.setItem("engram_onboarded", "true");
    setShowOnboard(false);
    fetchMemories();
  };

  const fetchMemories = useCallback(async () => {
    if (!USER_ID) return;
    setLoading(true);
    try {
      const res = await fetch("/api/memories", {
        headers: { "x-user-id": USER_ID },
      });
      const data = await res.json();
      setMemories(data.memories ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMemories();
  }, [fetchMemories]);

  if (!USER_ID) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center text-center px-4">
        <div className="glass rounded-3xl p-10 max-w-sm shadow-2xl">
          <div className="text-5xl mb-4">🧠</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Almost there!
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Add{" "}
            <code className="bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded text-xs font-mono">
              NEXT_PUBLIC_TEST_USER_ID
            </code>{" "}
            to your{" "}
            <code className="bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded text-xs font-mono">
              .env.local
            </code>{" "}
            to start.
          </p>
        </div>
      </div>
    );
  }

  const ideas = memories.filter((m) => m.source_type === "idea").length;
  const notes = memories.filter((m) => m.source_type === "note").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Onboarding overlay */}
      {showOnboard && <Onboarding userId={USER_ID} onDone={finishOnboarding} />}

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 p-5 shrink-0">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-2xl">🧠</span>
            <span className="font-black text-lg text-gray-900 tracking-tight">
              Engram
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-6">
            <div className="bg-violet-50 rounded-2xl p-3 text-center">
              <div className="text-xl font-black text-violet-600">
                {memories.length}
              </div>
              <div className="text-xs text-violet-500">Total</div>
            </div>
            <div className="bg-pink-50 rounded-2xl p-3 text-center">
              <div className="text-xl font-black text-pink-500">{ideas}</div>
              <div className="text-xs text-pink-500">Ideas</div>
            </div>
          </div>

          <nav className="space-y-1 flex-1">
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id as Tab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                  tab === item.id
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-200"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{item.icon}</span> {item.label}
              </button>
            ))}
          </nav>

          {/* Replay onboarding */}
          <button
            onClick={() => setShowOnboard(true)}
            className="text-xs text-gray-400 hover:text-violet-500 transition-colors mt-2 flex items-center gap-1"
          >
            🚀 Replay onboarding
          </button>

          <Link
            href="/"
            className="text-xs text-gray-400 hover:text-violet-500 transition-colors mt-2 flex items-center gap-1"
          >
            Back to home
          </Link>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white border-b border-gray-100 px-6 h-14 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="lg:hidden flex items-center gap-2">
                <span className="text-xl">🧠</span>
                <span className="font-black text-gray-900">Engram</span>
              </div>
              <div className="hidden lg:block">
                <h1 className="font-bold text-gray-900">
                  {tab === "ask"
                    ? "✨ Ask AI"
                    : tab === "analytics"
                      ? "📊 Analytics"
                      : "📚 Memories"}
                </h1>
              </div>
            </div>

            <div className="lg:hidden flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              {NAV.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id as Tab)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    tab === item.id
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  {item.icon}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 hidden sm:block">
                {notes} notes · {ideas} ideas
              </span>
              <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-purple-600 rounded-xl flex items-center justify-center text-white text-xs font-bold">
                Y
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
              <NoteInput userId={USER_ID} onSaved={fetchMemories} />

              {tab === "ask" && <AskBar userId={USER_ID} />}

              {tab === "memories" &&
                (loading ? (
                  <div className="flex items-center justify-center gap-3 py-20">
                    <div className="w-5 h-5 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
                    <span className="text-sm text-gray-400">
                      Loading your memories…
                    </span>
                  </div>
                ) : (
                  <MemoryList
                    memories={memories}
                    userId={USER_ID}
                    onDeleted={fetchMemories}
                  />
                ))}

              {tab === "analytics" &&
                (loading ? (
                  <div className="flex items-center justify-center gap-3 py-20">
                    <div className="w-5 h-5 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
                    <span className="text-sm text-gray-400">
                      Loading analytics…
                    </span>
                  </div>
                ) : (
                  <MemoryAnalytics memories={memories} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
