"use client";
import { useState, useRef } from "react";
import { SourceType } from "@/lib/supabase";
import VoiceInput from "@/components/VoiceInput";
import confetti from "canvas-confetti";

const TYPES: {
  value: SourceType;
  emoji: string;
  label: string;
  color: string;
}[] = [
  {
    value: "note",
    emoji: "📝",
    label: "Note",
    color: "from-violet-500 to-purple-600",
  },
  {
    value: "idea",
    emoji: "💡",
    label: "Idea",
    color: "from-amber-400 to-orange-500",
  },
  {
    value: "doc",
    emoji: "📄",
    label: "Doc",
    color: "from-sky-500 to-blue-600",
  },
];

function fireConfetti(buttonEl: HTMLButtonElement | null) {
  // Get button position for origin point
  const rect = buttonEl?.getBoundingClientRect();
  const x = rect ? (rect.left + rect.width / 2) / window.innerWidth : 0.5;
  const y = rect ? (rect.top + rect.height / 2) / window.innerHeight : 0.6;

  // First burst — big
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { x, y },
    colors: ["#7c3aed", "#a78bfa", "#c4b5fd", "#4f46e5", "#818cf8", "#fff"],
    scalar: 1.1,
    ticks: 200,
  });

  // Second burst — trails up
  setTimeout(() => {
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: x - 0.1, y },
      colors: ["#7c3aed", "#ec4899", "#f59e0b"],
      scalar: 0.9,
    });
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 55,
      origin: { x: x + 0.1, y },
      colors: ["#7c3aed", "#06b6d4", "#10b981"],
      scalar: 0.9,
    });
  }, 150);

  // Third burst — sparkle
  setTimeout(() => {
    confetti({
      particleCount: 30,
      spread: 100,
      origin: { x, y: y - 0.1 },
      colors: ["#ffffff", "#c4b5fd", "#a78bfa"],
      scalar: 0.6,
      ticks: 150,
    });
  }, 300);
}

export default function NoteInput({
  userId,
  onSaved,
}: {
  userId: string;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sourceType, setSourceType] = useState<SourceType>("note");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [focused, setFocused] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleSave = async () => {
    if (!content.trim() || saving) return;
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": userId },
        body: JSON.stringify({
          title: title.trim() || null,
          content: content.trim(),
          source_type: sourceType,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });
      if (!res.ok)
        throw new Error((await res.json()).error || "Failed to save");

      // Check if this is the first ever memory
      const isFirstMemory = !localStorage.getItem("engram_first_saved");
      if (isFirstMemory) {
        localStorage.setItem("engram_first_saved", "true");
        fireConfetti(btnRef.current);
      }

      setTitle("");
      setContent("");
      setTags("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
      onSaved();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const active = TYPES.find((t) => t.value === sourceType)!;

  return (
    <div
      className={`bg-white rounded-3xl border-2 transition-all duration-300 shadow-sm ${
        focused
          ? "border-violet-300 shadow-violet-100/50 shadow-lg"
          : "border-gray-100 hover:border-gray-200"
      }`}
    >
      {/* Gradient top bar */}
      <div
        className={`h-1.5 rounded-t-3xl bg-gradient-to-r ${active.color} transition-all duration-300`}
      />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            New memory
          </span>
          <div className="flex gap-1.5">
            {TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setSourceType(t.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  sourceType === t.value
                    ? `bg-gradient-to-r ${t.color} text-white shadow-md`
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
              >
                {t.emoji} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Title (optional)"
          className="w-full text-sm font-bold text-gray-800 placeholder:text-gray-300 bg-transparent border-0 border-b-2 border-gray-100 focus:border-violet-200 pb-2 mb-3 focus:outline-none transition-colors"
        />

        {/* Content */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSave();
          }}
          placeholder="What's on your mind? An idea, something you learned, a goal..."
          rows={3}
          className="w-full text-sm text-gray-700 placeholder:text-gray-300 bg-transparent resize-none focus:outline-none leading-relaxed mb-2"
        />

        {/* Voice input row */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-300">
            {content.length > 0
              ? `${content.length} chars`
              : "or speak your memory"}
          </span>
          <VoiceInput
            onTranscript={(text) =>
              setContent((prev) => (prev ? prev + " " + text : text))
            }
            disabled={saving}
          />
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 bg-gray-50/70 rounded-2xl px-3 py-2 mb-3 border border-gray-100">
          <span className="text-gray-300 text-xs">🏷</span>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags: react, startup, idea (comma separated)"
            className="flex-1 text-xs text-gray-600 placeholder:text-gray-300 bg-transparent focus:outline-none"
          />
        </div>

        {/* Tag preview */}
        {tags && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
              .map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-violet-50 text-violet-600 px-2.5 py-1 rounded-full border border-violet-100 font-medium"
                >
                  {tag}
                </span>
              ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-xs text-red-500 mb-3 flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-300">⌘↵ to save</span>
          <button
            ref={btnRef}
            onClick={handleSave}
            disabled={!content.trim() || saving}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
              success
                ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg shadow-green-200"
                : "btn-primary text-white disabled:opacity-30"
            }`}
          >
            {saving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : success ? (
              <>
                <span>✓</span> Saved!
              </>
            ) : (
              <>
                <span>🧠</span> Save to Engram
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
