"use client";
import { useState } from "react";
import { Memory } from "@/lib/supabase";

const DOMAINS = [
  { id: "dev", emoji: "💻", label: "Development" },
  { id: "design", emoji: "🎨", label: "Design" },
  { id: "ml", emoji: "🤖", label: "Machine Learning" },
  { id: "research", emoji: "🔬", label: "Research" },
  { id: "writing", emoji: "✍️", label: "Writing" },
  { id: "business", emoji: "🚀", label: "Business" },
  { id: "health", emoji: "💪", label: "Health" },
  { id: "finance", emoji: "💰", label: "Finance" },
];

type Profile = {
  name: string;
  role: string;
  bio: string;
  goals: string;
  strengths: string;
  domains: string[];
};

type Props = {
  memories: Memory[];
  userId: string;
};

export default function ProfilePage({ memories, userId }: Props) {
  const [profile, setProfile] = useState<Profile>({
    name: "",
    role: "",
    bio: "",
    goals: "",
    strengths: "",
    domains: [],
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<"profile" | "export">("profile");

  const update = (key: keyof Profile, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const toggleDomain = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      domains: prev.domains.includes(id)
        ? prev.domains.filter((d) => d !== id)
        : [...prev.domains, id],
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    // Save to localStorage for now — replace with Supabase profiles table later
    localStorage.setItem("engram_profile", JSON.stringify(profile));
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Export memories as JSON
  const exportJSON = () => {
    const data = JSON.stringify(
      { profile, memories, exportedAt: new Date().toISOString() },
      null,
      2,
    );
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "engram-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export memories as Markdown
  const exportMarkdown = () => {
    const lines = [
      "# Engram Memory Export",
      "",
      `**Exported:** ${new Date().toLocaleDateString()}`,
      `**Total memories:** ${memories.length}`,
      "",
      "---",
      "",
      ...memories.map((m) =>
        [
          `## ${m.title || "Untitled"}`,
          `**Type:** ${m.source_type} | **Date:** ${new Date(m.created_at).toLocaleDateString()}`,
          m.tags.length > 0
            ? `**Tags:** ${m.tags.map((t) => "#" + t).join(", ")}`
            : "",
          "",
          m.content,
          "",
          "---",
          "",
        ]
          .filter(Boolean)
          .join("\n"),
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "engram-export.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Compute avatar initials
  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "ME";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header card */}
      <div
        style={{
          background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
          borderRadius: 24,
          padding: "28px 24px",
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: "rgba(255,255,255,0.2)",
            border: "2px solid rgba(255,255,255,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
            fontWeight: 800,
            color: "white",
            flexShrink: 0,
            letterSpacing: "-0.02em",
          }}
        >
          {initials}
        </div>
        <div>
          <div
            style={{
              color: "white",
              fontWeight: 800,
              fontSize: 20,
              lineHeight: 1.2,
            }}
          >
            {profile.name || "Your Name"}
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: 14,
              marginTop: 4,
            }}
          >
            {profile.role || "Add your role below"}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
            <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 12 }}>
              <strong>{memories.length}</strong> memories
            </div>
            <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 12 }}>
              <strong>
                {memories.filter((m) => m.source_type === "idea").length}
              </strong>{" "}
              ideas
            </div>
            <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 12 }}>
              <strong>{profile.domains.length}</strong> domains
            </div>
          </div>
        </div>
      </div>

      {/* Tab switcher */}
      <div
        style={{
          display: "flex",
          background: "#f8fafc",
          borderRadius: 16,
          padding: 4,
          border: "1px solid #f1f5f9",
        }}
      >
        {[
          { id: "profile", label: "👤 Profile" },
          { id: "export", label: "📤 Export data" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: 12,
              border: "none",
              background: tab === t.id ? "#fff" : "transparent",
              fontSize: 13,
              fontWeight: 600,
              color: tab === t.id ? "#7c3aed" : "#64748b",
              cursor: "pointer",
              boxShadow: tab === t.id ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
              transition: "all 0.2s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {tab === "profile" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Name + role row */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 6,
                }}
              >
                Full name
              </label>
              <input
                value={profile.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Arjun Sharma"
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: 14,
                  border: "2px solid #e2e8f0",
                  fontSize: 14,
                  outline: "none",
                  color: "#0f172a",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#a78bfa")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 6,
                }}
              >
                Role / Title
              </label>
              <input
                value={profile.role}
                onChange={(e) => update("role", e.target.value)}
                placeholder="CS Student / Developer"
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: 14,
                  border: "2px solid #e2e8f0",
                  fontSize: 14,
                  outline: "none",
                  color: "#0f172a",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#a78bfa")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 700,
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 6,
              }}
            >
              Bio
            </label>
            <textarea
              value={profile.bio}
              onChange={(e) => update("bio", e.target.value)}
              placeholder="Tell Engram about yourself — what you're building, studying, or working on..."
              rows={3}
              style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: 14,
                border: "2px solid #e2e8f0",
                fontSize: 14,
                outline: "none",
                resize: "none",
                color: "#0f172a",
                fontFamily: "inherit",
                lineHeight: 1.6,
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#a78bfa")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
          </div>

          {/* Goals */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 700,
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 6,
              }}
            >
              Goals
            </label>
            <textarea
              value={profile.goals}
              onChange={(e) => update("goals", e.target.value)}
              placeholder="Get a job at a top tech company, build an AI startup, publish research..."
              rows={2}
              style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: 14,
                border: "2px solid #e2e8f0",
                fontSize: 14,
                outline: "none",
                resize: "none",
                color: "#0f172a",
                fontFamily: "inherit",
                lineHeight: 1.6,
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#a78bfa")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
          </div>

          {/* Strengths */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 700,
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 6,
              }}
            >
              Strengths
            </label>
            <input
              value={profile.strengths}
              onChange={(e) => update("strengths", e.target.value)}
              placeholder="Python, React, System Design, Communication..."
              style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: 14,
                border: "2px solid #e2e8f0",
                fontSize: 14,
                outline: "none",
                color: "#0f172a",
                fontFamily: "inherit",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#a78bfa")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
          </div>

          {/* Domains */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 700,
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 10,
              }}
            >
              Domains
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 8,
              }}
            >
              {DOMAINS.map((d) => {
                const selected = profile.domains.includes(d.id);
                return (
                  <button
                    key={d.id}
                    onClick={() => toggleDomain(d.id)}
                    style={{
                      padding: "10px 8px",
                      borderRadius: 12,
                      border: selected
                        ? "2px solid #7c3aed"
                        : "2px solid #e2e8f0",
                      background: selected ? "#f5f3ff" : "#fafafa",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{ fontSize: 18, marginBottom: 4 }}>
                      {d.emoji}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: selected ? "#7c3aed" : "#475569",
                        lineHeight: 1.2,
                      }}
                    >
                      {d.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              width: "100%",
              padding: "13px 0",
              borderRadius: 14,
              border: "none",
              background: saved
                ? "linear-gradient(135deg, #10b981, #059669)"
                : "linear-gradient(135deg, #7c3aed, #4f46e5)",
              color: "white",
              fontWeight: 700,
              fontSize: 14,
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.7 : 1,
              boxShadow: "0 4px 16px rgba(124,58,237,0.3)",
              transition: "all 0.3s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {saving ? (
              <>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    border: "2px solid rgba(255,255,255,0.4)",
                    borderTop: "2px solid white",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                Saving profile...
              </>
            ) : saved ? (
              <>
                <span>✓</span> Profile saved!
              </>
            ) : (
              <>
                <span>💾</span> Save profile
              </>
            )}
          </button>
        </div>
      )}

      {/* Export tab */}
      {tab === "export" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              background: "#f8fafc",
              borderRadius: 16,
              padding: "16px 20px",
              border: "1px solid #f1f5f9",
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#0f172a",
                marginBottom: 4,
              }}
            >
              Your data
            </div>
            <div style={{ fontSize: 13, color: "#64748b" }}>
              {memories.length} memories ·{" "}
              {memories
                .reduce((a, m) => a + m.content.split(" ").length, 0)
                .toLocaleString()}{" "}
              words
            </div>
          </div>

          {/* JSON export */}
          <div
            style={{
              background: "#fff",
              border: "1.5px solid #f1f5f9",
              borderRadius: 20,
              padding: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: "#fef3c7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                📦
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#0f172a",
                    marginBottom: 4,
                  }}
                >
                  Export as JSON
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#64748b",
                    marginBottom: 14,
                    lineHeight: 1.5,
                  }}
                >
                  Full export with all memory data, tags, timestamps, and
                  profile. Perfect for backup or importing elsewhere.
                </div>
                <button
                  onClick={exportJSON}
                  style={{
                    padding: "9px 18px",
                    borderRadius: 12,
                    border: "1.5px solid #e2e8f0",
                    background: "#fff",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#374151",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#7c3aed";
                    e.currentTarget.style.color = "#7c3aed";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.color = "#374151";
                  }}
                >
                  Download .json
                </button>
              </div>
            </div>
          </div>

          {/* Markdown export */}
          <div
            style={{
              background: "#fff",
              border: "1.5px solid #f1f5f9",
              borderRadius: 20,
              padding: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: "#f0fdf4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                📝
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#0f172a",
                    marginBottom: 4,
                  }}
                >
                  Export as Markdown
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#64748b",
                    marginBottom: 14,
                    lineHeight: 1.5,
                  }}
                >
                  All memories formatted as readable Markdown. Great for
                  Obsidian, Notion import, or reading offline.
                </div>
                <button
                  onClick={exportMarkdown}
                  style={{
                    padding: "9px 18px",
                    borderRadius: 12,
                    border: "1.5px solid #e2e8f0",
                    background: "#fff",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#374151",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#10b981";
                    e.currentTarget.style.color = "#10b981";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.color = "#374151";
                  }}
                >
                  Download .md
                </button>
              </div>
            </div>
          </div>

          {/* Danger zone */}
          <div
            style={{
              background: "#fff",
              border: "1.5px solid #fee2e2",
              borderRadius: 20,
              padding: "20px",
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#dc2626",
                marginBottom: 8,
              }}
            >
              Danger zone
            </div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 14 }}>
              Clear onboarding and profile data stored locally on this device.
            </div>
            <button
              onClick={() => {
                if (confirm("Clear all local data? This cannot be undone.")) {
                  localStorage.removeItem("engram_profile");
                  localStorage.removeItem("engram_onboarded");
                  localStorage.removeItem("engram_first_saved");
                  window.location.reload();
                }
              }}
              style={{
                padding: "9px 18px",
                borderRadius: 12,
                border: "1.5px solid #fca5a5",
                background: "#fff5f5",
                fontSize: 13,
                fontWeight: 600,
                color: "#dc2626",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              Clear local data
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
