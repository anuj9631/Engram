"use client";
import { useState } from "react";
import { Memory } from "@/lib/supabase";

const ICONS: Record<string, string> = {
  note: "📝",
  idea: "💡",
  doc: "📄",
  chat: "💬",
};

const TYPE_COLORS: Record<string, string> = {
  note: "bg-violet-100 text-violet-600",
  idea: "bg-amber-100 text-amber-600",
  doc: "bg-sky-100 text-sky-600",
  chat: "bg-emerald-100 text-emerald-600",
};

export default function MemoryList({
  memories,
  userId,
  onDeleted,
}: {
  memories: Memory[];
  userId: string;
  onDeleted: () => void;
}) {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const allTags = Array.from(new Set(memories.flatMap((m) => m.tags))).sort();

  const filtered = memories.filter((m) => {
    const q = search.toLowerCase();
    return (
      (!activeTag || m.tags.includes(activeTag)) &&
      (!activeType || m.source_type === activeType) &&
      (!q ||
        m.content.toLowerCase().includes(q) ||
        m.title?.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q)))
    );
  });

  const groups = filtered.reduce<Record<string, Memory[]>>((acc, m) => {
    const label = new Date(m.created_at).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    (acc[label] ??= []).push(m);
    return acc;
  }, {});

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this memory? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/memories?id=${id}`, {
        method: "DELETE",
        headers: { "x-user-id": userId },
      });
      onDeleted();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
          🔍
        </span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your memories…"
          className="w-full pl-10 pr-10 py-3.5 text-sm bg-white border-2 border-gray-100 focus:border-violet-300 rounded-2xl focus:outline-none transition-colors placeholder:text-gray-300 shadow-sm"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
          >
            ✕
          </button>
        )}
      </div>

      {/* Type filters */}
      <div className="flex gap-2 flex-wrap">
        {["note", "idea", "doc"].map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(activeType === type ? null : type)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeType === type
                ? TYPE_COLORS[type]
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {ICONS[type]} {type}
          </button>
        ))}
      </div>

      {/* Tag filters */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all font-medium ${
                activeTag === tag
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-white text-gray-500 border-gray-200 hover:border-violet-300 hover:text-violet-500"
              }`}
            >
              # {tag}
            </button>
          ))}
        </div>
      )}

      {/* Count + clear */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400 font-medium">
          {filtered.length} memor{filtered.length === 1 ? "y" : "ies"}
          {(search || activeTag || activeType) && " matching filters"}
        </p>
        {(search || activeTag || activeType) && (
          <button
            onClick={() => {
              setSearch("");
              setActiveTag(null);
              setActiveType(null);
            }}
            className="text-xs text-violet-500 hover:text-violet-700 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
          <div className="text-5xl mb-4">🧠</div>
          <p className="text-base font-bold text-gray-700 mb-1">
            {search || activeTag || activeType
              ? "No memories match this filter"
              : "No memories yet"}
          </p>
          <p className="text-sm text-gray-400">
            {search || activeTag || activeType
              ? "Try different keywords or clear filters"
              : "Add your first memory above to get started"}
          </p>
        </div>
      )}

      {/* Memory groups */}
      {Object.entries(groups).map(([date, mems]) => (
        <div key={date}>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0">
              {date}
            </p>
            <div className="h-px flex-1 bg-gradient-to-l from-gray-200 to-transparent" />
          </div>

          <div className="space-y-2">
            {mems.map((m) => {
              const isExpanded = expanded === m.id;
              return (
                <div
                  key={m.id}
                  className={`group bg-white rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
                    isExpanded
                      ? "border-violet-200 shadow-lg shadow-violet-100/30"
                      : "border-gray-100 hover:border-violet-200 hover:shadow-md hover:shadow-violet-100/20"
                  }`}
                >
                  {/* Type accent bar */}
                  <div
                    className={`h-0.5 ${
                      m.source_type === "idea"
                        ? "bg-amber-400"
                        : m.source_type === "doc"
                          ? "bg-sky-400"
                          : "bg-violet-400"
                    }`}
                  />

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => setExpanded(isExpanded ? null : m.id)}
                      >
                        {/* Title row */}
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-lg font-bold ${TYPE_COLORS[m.source_type]}`}
                          >
                            {ICONS[m.source_type]} {m.source_type}
                          </span>
                          {m.title && (
                            <span className="text-sm font-bold text-gray-900">
                              {m.title}
                            </span>
                          )}
                          {m.tags.map((tag) => (
                            <button
                              key={tag}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTag(tag === activeTag ? null : tag);
                              }}
                              className="text-xs bg-violet-50 text-violet-500 hover:bg-violet-100 px-2 py-0.5 rounded-full border border-violet-100 font-medium transition-colors"
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>

                        {/* Content */}
                        <p
                          className={`text-sm text-gray-600 leading-relaxed ${isExpanded ? "" : "line-clamp-2"}`}
                        >
                          {m.content}
                        </p>

                        {!isExpanded && m.content.length > 120 && (
                          <span className="text-xs text-violet-400 mt-1 block">
                            Show more…
                          </span>
                        )}
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(m.id)}
                        disabled={deletingId === m.id}
                        className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 disabled:opacity-20 transition-all text-xl shrink-0 w-7 h-7 rounded-xl hover:bg-red-50 flex items-center justify-center"
                      >
                        {deletingId === m.id ? "…" : "×"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
