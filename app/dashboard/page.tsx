"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NoteInput from "@/components/NoteInput";
import AskBar from "@/components/AskBar";
import MemoryList from "@/components/MemoryList";
import MemoryAnalytics from "@/components/MemoryAnalytics";
import Onboarding from "@/components/Onboarding";
import ProfilePage from "@/components/ProfilePage";
import { Memory, supabase, signOut } from "@/lib/supabase";

type Tab = "memories" | "ask" | "analytics" | "profile";

const NAV = [
  { id: "memories", icon: "📚", label: "All memories" },
  { id: "ask", icon: "✨", label: "Ask AI" },
  { id: "analytics", icon: "📊", label: "Analytics" },
  { id: "profile", icon: "👤", label: "Profile" },
];

export default function Dashboard() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("memories");
  const [showOnboard, setShowOnboard] = useState(false);

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        // Not logged in — redirect to home
        router.push("/");
        return;
      }
      setUserId(session.user.id);
      setUserEmail(session.user.email ?? "");
      setAuthLoading(false);

      // Show onboarding on first visit
      const done = localStorage.getItem("engram_onboarded");
      if (!done) setShowOnboard(true);
    };

    checkAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/");
      } else {
        setUserId(session.user.id);
        setUserEmail(session.user.email ?? "");
        setAuthLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const finishOnboarding = () => {
    localStorage.setItem("engram_onboarded", "true");
    setShowOnboard(false);
    fetchMemories();
  };

  const fetchMemories = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/memories", {
        headers: { "x-user-id": userId },
      });
      const data = await res.json();
      setMemories(data.memories ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) fetchMemories();
  }, [userId, fetchMemories]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  // Auth loading state
  if (authLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading Engram...</p>
        </div>
      </div>
    );
  }

  const ideas = memories.filter((m) => m.source_type === "idea").length;
  const notes = memories.filter((m) => m.source_type === "note").length;
  const initials = userEmail ? userEmail[0].toUpperCase() : "U";

  const tabTitle: Record<Tab, string> = {
    memories: "📚 Memories",
    ask: "✨ Ask AI",
    analytics: "📊 Analytics",
    profile: "👤 Profile",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showOnboard && userId && (
        <Onboarding userId={userId} onDone={finishOnboarding} />
      )}

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 p-5 shrink-0">
          <div className="flex items-center gap-2 mb-8">
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="10" fill="#7c3aed" />
              <rect x="10" y="10" width="18" height="4" rx="2" fill="white" />
              <rect x="10" y="10" width="4" height="20" rx="2" fill="white" />
              <rect
                x="10"
                y="18"
                width="13"
                height="4"
                rx="2"
                fill="white"
                opacity="0.8"
              />
              <rect x="10" y="26" width="18" height="4" rx="2" fill="white" />
              <circle cx="28" cy="12" r="2.5" fill="#c4b5fd" />
              <circle cx="23" cy="20" r="2.5" fill="#c4b5fd" />
              <circle cx="28" cy="28" r="2.5" fill="#c4b5fd" />
            </svg>
            <span className="font-black text-lg text-gray-900 tracking-tight">
              Engram
            </span>
          </div>

          {/* User info */}
          <div className="flex items-center gap-3 mb-6 p-3 bg-violet-50 rounded-2xl">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-400 to-purple-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-gray-800 truncate">
                {userEmail}
              </div>
              <div className="text-xs text-violet-500">
                {memories.length} memories
              </div>
            </div>
          </div>

          {/* Stats */}
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

          {/* Nav */}
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

          <button
            onClick={() => setShowOnboard(true)}
            className="text-xs text-gray-400 hover:text-violet-500 transition-colors mt-2 text-left"
          >
            🚀 Replay onboarding
          </button>

          <Link
            href="/"
            className="text-xs text-gray-400 hover:text-violet-500 transition-colors mt-2"
          >
            Back to home
          </Link>

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            className="mt-3 flex items-center gap-2 text-xs text-red-400 hover:text-red-600 transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16,17 21,12 16,7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign out
          </button>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white border-b border-gray-100 px-6 h-14 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="lg:hidden flex items-center gap-2">
                <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                  <rect width="40" height="40" rx="10" fill="#7c3aed" />
                  <rect
                    x="10"
                    y="10"
                    width="18"
                    height="4"
                    rx="2"
                    fill="white"
                  />
                  <rect
                    x="10"
                    y="10"
                    width="4"
                    height="20"
                    rx="2"
                    fill="white"
                  />
                  <rect
                    x="10"
                    y="18"
                    width="13"
                    height="4"
                    rx="2"
                    fill="white"
                    opacity="0.8"
                  />
                  <rect
                    x="10"
                    y="26"
                    width="18"
                    height="4"
                    rx="2"
                    fill="white"
                  />
                  <circle cx="28" cy="12" r="2.5" fill="#c4b5fd" />
                  <circle cx="23" cy="20" r="2.5" fill="#c4b5fd" />
                  <circle cx="28" cy="28" r="2.5" fill="#c4b5fd" />
                </svg>
                <span className="font-black text-gray-900">Engram</span>
              </div>
              <div className="hidden lg:block">
                <h1 className="font-bold text-gray-900">{tabTitle[tab]}</h1>
              </div>
            </div>

            {/* Mobile tabs */}
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
              <button
                onClick={() => setTab("profile")}
                className="w-8 h-8 bg-gradient-to-br from-violet-400 to-purple-600 rounded-xl flex items-center justify-center text-white text-xs font-bold hover:scale-105 transition-transform"
              >
                {initials}
              </button>
              {/* Mobile sign out */}
              <button
                onClick={handleSignOut}
                className="lg:hidden text-xs text-red-400 hover:text-red-600 p-1"
                title="Sign out"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16,17 21,12 16,7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
              {userId && tab !== "profile" && (
                <NoteInput userId={userId} onSaved={fetchMemories} />
              )}

              {tab === "ask" && userId && <AskBar userId={userId} />}

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
                    userId={userId!}
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

              {tab === "profile" && userId && (
                <ProfilePage memories={memories} userId={userId} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
