"use client";
import { useState, useEffect, useCallback } from "react";
import { Command } from "cmdk";

type Action = {
  id: string;
  icon: string;
  label: string;
  description: string;
  group: string;
  action: () => void;
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Open on Cmd+K or Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const run = useCallback((fn: () => void) => {
    setOpen(false);
    setQuery("");
    setTimeout(fn, 100);
  }, []);

  const ACTIONS: Action[] = [
    // Navigation
    {
      id: "home",
      icon: "🏠",
      label: "Go to Home",
      description: "Back to landing page",
      group: "Navigate",
      action: () => run(() => (window.location.href = "/")),
    },
    {
      id: "dashboard",
      icon: "📚",
      label: "Open Dashboard",
      description: "View all your memories",
      group: "Navigate",
      action: () => run(() => (window.location.href = "/dashboard")),
    },
    {
      id: "ask",
      icon: "✨",
      label: "Ask AI",
      description: "Ask your second brain",
      group: "Navigate",
      action: () =>
        run(() => {
          window.location.href = "/dashboard";
        }),
    },
    // Actions
    {
      id: "new-note",
      icon: "📝",
      label: "New Note",
      description: "Add a new note memory",
      group: "Actions",
      action: () => run(() => (window.location.href = "/dashboard")),
    },
    {
      id: "new-idea",
      icon: "💡",
      label: "New Idea",
      description: "Capture a new idea",
      group: "Actions",
      action: () => run(() => (window.location.href = "/dashboard")),
    },
    {
      id: "new-doc",
      icon: "📄",
      label: "New Document",
      description: "Add a document memory",
      group: "Actions",
      action: () => run(() => (window.location.href = "/dashboard")),
    },
    // Theme
    {
      id: "dark",
      icon: "🌙",
      label: "Dark mode",
      description: "Switch to dark theme",
      group: "Settings",
      action: () => run(() => document.documentElement.classList.add("dark")),
    },
    {
      id: "light",
      icon: "☀️",
      label: "Light mode",
      description: "Switch to light theme",
      group: "Settings",
      action: () =>
        run(() => document.documentElement.classList.remove("dark")),
    },
    // Links
    {
      id: "features",
      icon: "⚡",
      label: "Features",
      description: "See what Engram can do",
      group: "Explore",
      action: () =>
        run(() =>
          document
            .querySelector("#features")
            ?.scrollIntoView({ behavior: "smooth" }),
        ),
    },
    {
      id: "howitworks",
      icon: "🔍",
      label: "How it works",
      description: "Learn the RAG pipeline",
      group: "Explore",
      action: () =>
        run(() =>
          document
            .querySelector("#how-it-works")
            ?.scrollIntoView({ behavior: "smooth" }),
        ),
    },
  ];

  const filtered =
    query.trim() === ""
      ? ACTIONS
      : ACTIONS.filter(
          (a) =>
            a.label.toLowerCase().includes(query.toLowerCase()) ||
            a.description.toLowerCase().includes(query.toLowerCase()) ||
            a.group.toLowerCase().includes(query.toLowerCase()),
        );

  const groups = Array.from(new Set(filtered.map((a) => a.group)));

  if (!open)
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "7px 12px",
          borderRadius: 10,
          border: "1.5px solid rgba(124,58,237,0.2)",
          background: "rgba(124,58,237,0.05)",
          cursor: "pointer",
          fontSize: 13,
          color: "#64748b",
          transition: "all 0.2s",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)";
          e.currentTarget.style.background = "rgba(124,58,237,0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(124,58,237,0.2)";
          e.currentTarget.style.background = "rgba(124,58,237,0.05)";
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        Search...
        <span
          style={{
            display: "flex",
            gap: 3,
            marginLeft: 4,
          }}
        >
          <kbd
            style={{
              padding: "1px 5px",
              borderRadius: 5,
              background: "rgba(124,58,237,0.1)",
              border: "1px solid rgba(124,58,237,0.2)",
              fontSize: 11,
              color: "#7c3aed",
              fontFamily: "monospace",
            }}
          >
            ⌘
          </kbd>
          <kbd
            style={{
              padding: "1px 5px",
              borderRadius: 5,
              background: "rgba(124,58,237,0.1)",
              border: "1px solid rgba(124,58,237,0.2)",
              fontSize: 11,
              color: "#7c3aed",
              fontFamily: "monospace",
            }}
          >
            K
          </kbd>
        </span>
      </button>
    );

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "15vh",
        background: "rgba(15,10,30,0.6)",
        backdropFilter: "blur(8px)",
      }}
    >
      <Command
        style={{
          width: "100%",
          maxWidth: 560,
          background: "#fff",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow:
            "0 32px 80px rgba(15,23,42,0.25), 0 0 0 1px rgba(124,58,237,0.15)",
          margin: "0 16px",
        }}
      >
        {/* Search input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "16px 20px",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <Command.Input
            value={query}
            onValueChange={setQuery}
            placeholder="Search anything or type a command..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: 15,
              color: "#0f172a",
              background: "transparent",
              fontFamily: "inherit",
            }}
            autoFocus
          />
          <kbd
            onClick={() => setOpen(false)}
            style={{
              padding: "3px 8px",
              borderRadius: 7,
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              fontSize: 12,
              color: "#94a3b8",
              cursor: "pointer",
              fontFamily: "monospace",
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results */}
        <Command.List
          style={{ maxHeight: 380, overflowY: "auto", padding: "8px 0" }}
        >
          <Command.Empty
            style={{
              padding: "32px 20px",
              textAlign: "center",
              color: "#94a3b8",
              fontSize: 14,
            }}
          >
            No results for "{query}"
          </Command.Empty>

          {groups.map((group) => {
            const items = filtered.filter((a) => a.group === group);
            return (
              <Command.Group key={group}>
                {/* Group label */}
                <div
                  style={{
                    padding: "8px 20px 4px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {group}
                </div>

                {items.map((item) => (
                  <Command.Item
                    key={item.id}
                    value={item.label}
                    onSelect={item.action}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 20px",
                      cursor: "pointer",
                      borderRadius: 0,
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f5f3ff")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        background: "linear-gradient(135deg, #f5f3ff, #ede9fe)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: "#0f172a",
                        }}
                      >
                        {item.label}
                      </div>
                      <div
                        style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}
                      >
                        {item.description}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#cbd5e1",
                        fontFamily: "monospace",
                        flexShrink: 0,
                      }}
                    >
                      ↵
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            );
          })}
        </Command.List>

        {/* Footer */}
        <div
          style={{
            padding: "10px 20px",
            borderTop: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            gap: 16,
            background: "#fafafa",
          }}
        >
          {[
            { keys: ["↑", "↓"], label: "Navigate" },
            { keys: ["↵"], label: "Select" },
            { keys: ["ESC"], label: "Close" },
          ].map((tip) => (
            <div
              key={tip.label}
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              {tip.keys.map((k) => (
                <kbd
                  key={k}
                  style={{
                    padding: "2px 6px",
                    borderRadius: 5,
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    fontSize: 11,
                    color: "#64748b",
                    fontFamily: "monospace",
                  }}
                >
                  {k}
                </kbd>
              ))}
              <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 2 }}>
                {tip.label}
              </span>
            </div>
          ))}
          <div
            style={{
              marginLeft: "auto",
              fontSize: 11,
              color: "#c4b5fd",
              fontWeight: 600,
            }}
          >
            Engram
          </div>
        </div>
      </Command>
    </div>
  );
}
