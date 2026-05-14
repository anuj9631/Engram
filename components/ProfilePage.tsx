"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Memory, supabase } from "@/lib/supabase";

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
  const { theme } = useTheme();
  const dark = theme === "dark";

  // ── colour palette ──────────────────────────────────────────
  const c = {
    pageBg: dark ? "#0f172a" : "transparent",
    card: dark ? "#1e293b" : "#f8fafc",
    cardBorder: dark ? "#334155" : "#f1f5f9",
    exportCard: dark ? "#1e293b" : "#ffffff",
    exportBorder: dark ? "#334155" : "#f1f5f9",
    input: dark ? "#1e293b" : "#ffffff",
    inputBorder: dark ? "#475569" : "#e2e8f0",
    inputText: dark ? "#f1f5f9" : "#0f172a",
    label: dark ? "#94a3b8" : "#64748b",
    text: dark ? "#f1f5f9" : "#0f172a",
    subtext: dark ? "#94a3b8" : "#64748b",
    domainBg: dark ? "#0f172a" : "#fafafa",
    domainSel: dark ? "#2e1065" : "#f5f3ff",
    domainBorder: dark ? "#475569" : "#e2e8f0",
    tabBg: dark ? "#1e293b" : "#f8fafc",
    tabActive: dark ? "#0f172a" : "#ffffff",
    tabBorder: dark ? "#334155" : "#f1f5f9",
    dangerCard: dark ? "#1e293b" : "#ffffff",
    dangerBorder: dark ? "#7f1d1d" : "#fee2e2",
    dangerBtn: dark ? "#2d0a0a" : "#fff5f5",
    dangerBtnBorder: dark ? "#ef4444" : "#fca5a5",
    iconYellow: dark ? "#2d2000" : "#fef3c7",
    iconGreen: dark ? "#052e16" : "#f0fdf4",
    dlBtn: dark ? "#1e293b" : "#ffffff",
    dlBtnBorder: dark ? "#475569" : "#e2e8f0",
    dlBtnText: dark ? "#e2e8f0" : "#374151",
  };
  // ────────────────────────────────────────────────────────────

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"profile" | "export">("profile");

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const { data } = await supabase
          .from("profiles")
          .select("full_name, role, bio, goals, strengths, domains")
          .eq("id", userId)
          .single();
        if (data) {
          setProfile({
            name: data.full_name || "",
            role: data.role || "",
            bio: data.bio || "",
            goals: data.goals || "",
            strengths: data.strengths || "",
            domains: data.domains || [],
          });
        }
      } catch (e) {
        console.error("Failed to load profile:", e);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [userId]);

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
    setError("");
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: userId,
        full_name: profile.name,
        role: profile.role,
        bio: profile.bio,
        goals: profile.goals,
        strengths: profile.strengths,
        domains: profile.domains,
      });
      if (error) throw error;
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

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

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "ME";

  // shared styles for inputs / textareas
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 14,
    border: `2px solid ${c.inputBorder}`,
    fontSize: 14,
    outline: "none",
    color: c.inputText,
    background: c.input,
    fontFamily: "inherit",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };
  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    color: c.label,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: 6,
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 0",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            border: "2px solid #ede9fe",
            borderTop: "2px solid #7c3aed",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <span style={{ fontSize: 14, color: c.subtext }}>
          Loading your profile...
        </span>
        <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        background: c.pageBg,
      }}
    >
      {/* ── Header card ── */}
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

      {/* ── Tab switcher ── */}
      <div
        style={{
          display: "flex",
          background: c.tabBg,
          borderRadius: 16,
          padding: 4,
          border: `1px solid ${c.tabBorder}`,
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
              background: tab === t.id ? c.tabActive : "transparent",
              fontSize: 13,
              fontWeight: 600,
              color: tab === t.id ? "#7c3aed" : c.subtext,
              cursor: "pointer",
              boxShadow: tab === t.id ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
              transition: "all 0.2s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Profile tab ── */}
      {tab === "profile" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Name + Role row */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <label style={labelStyle}>Full name</label>
              <input
                value={profile.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Arjun Sharma"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#a78bfa")}
                onBlur={(e) => (e.target.style.borderColor = c.inputBorder)}
              />
            </div>
            <div>
              <label style={labelStyle}>Role / Title</label>
              <input
                value={profile.role}
                onChange={(e) => update("role", e.target.value)}
                placeholder="CS Student / Developer"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#a78bfa")}
                onBlur={(e) => (e.target.style.borderColor = c.inputBorder)}
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label style={labelStyle}>Bio</label>
            <textarea
              value={profile.bio}
              onChange={(e) => update("bio", e.target.value)}
              placeholder="Tell Engram about yourself..."
              rows={3}
              style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }}
              onFocus={(e) => (e.target.style.borderColor = "#a78bfa")}
              onBlur={(e) => (e.target.style.borderColor = c.inputBorder)}
            />
          </div>

          {/* Goals */}
          <div>
            <label style={labelStyle}>Goals</label>
            <textarea
              value={profile.goals}
              onChange={(e) => update("goals", e.target.value)}
              placeholder="Get a job at a top tech company, build an AI startup..."
              rows={2}
              style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }}
              onFocus={(e) => (e.target.style.borderColor = "#a78bfa")}
              onBlur={(e) => (e.target.style.borderColor = c.inputBorder)}
            />
          </div>

          {/* Strengths */}
          <div>
            <label style={labelStyle}>Strengths</label>
            <input
              value={profile.strengths}
              onChange={(e) => update("strengths", e.target.value)}
              placeholder="Python, React, System Design..."
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#a78bfa")}
              onBlur={(e) => (e.target.style.borderColor = c.inputBorder)}
            />
          </div>

          {/* Domains */}
          <div>
            <label style={{ ...labelStyle, marginBottom: 10 }}>Domains</label>
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
                        : `2px solid ${c.domainBorder}`,
                      background: selected ? c.domainSel : c.domainBg,
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
                        color: selected ? "#a78bfa" : c.subtext,
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

          {/* Error */}
          {error && (
            <div
              style={{
                padding: "10px 14px",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 12,
                fontSize: 13,
                color: "#dc2626",
              }}
            >
              ⚠ {error}
            </div>
          )}

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
                Saving...
              </>
            ) : saved ? (
              <>
                <span>✓</span> Profile saved to cloud!
              </>
            ) : (
              <>
                <span>💾</span> Save profile
              </>
            )}
          </button>

          <p
            style={{
              textAlign: "center",
              fontSize: 12,
              color: c.subtext,
              marginTop: -8,
            }}
          >
            Saved permanently to your Supabase account
          </p>
        </div>
      )}

      {/* ── Export tab ── */}
      {tab === "export" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Stats summary */}
          <div
            style={{
              background: c.card,
              borderRadius: 16,
              padding: "16px 20px",
              border: `1px solid ${c.cardBorder}`,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: c.text,
                marginBottom: 4,
              }}
            >
              Your data
            </div>
            <div style={{ fontSize: 13, color: c.subtext }}>
              {memories.length} memories ·{" "}
              {memories
                .reduce((a, m) => a + m.content.split(" ").length, 0)
                .toLocaleString()}{" "}
              words
            </div>
          </div>

          {/* Export options */}
          {[
            {
              icon: "📦",
              title: "Export as JSON",
              desc: "Full export with all memory data, tags, timestamps, and profile. Perfect for backup.",
              iconBg: c.iconYellow,
              fn: exportJSON,
              file: ".json",
              hover: "#7c3aed",
            },
            {
              icon: "📝",
              title: "Export as Markdown",
              desc: "All memories formatted as readable Markdown. Great for Obsidian or Notion import.",
              iconBg: c.iconGreen,
              fn: exportMarkdown,
              file: ".md",
              hover: "#10b981",
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                background: c.exportCard,
                border: `1.5px solid ${c.exportBorder}`,
                borderRadius: 20,
                padding: "20px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "flex-start", gap: 14 }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: item.iconBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: c.text,
                      marginBottom: 4,
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: c.subtext,
                      marginBottom: 14,
                      lineHeight: 1.5,
                    }}
                  >
                    {item.desc}
                  </div>
                  <button
                    onClick={item.fn}
                    style={{
                      padding: "9px 18px",
                      borderRadius: 12,
                      border: `1.5px solid ${c.dlBtnBorder}`,
                      background: c.dlBtn,
                      fontSize: 13,
                      fontWeight: 600,
                      color: c.dlBtnText,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = item.hover;
                      e.currentTarget.style.color = item.hover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = c.dlBtnBorder;
                      e.currentTarget.style.color = c.dlBtnText;
                    }}
                  >
                    Download {item.file}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Danger zone */}
          <div
            style={{
              background: c.dangerCard,
              border: `1.5px solid ${c.dangerBorder}`,
              borderRadius: 20,
              padding: "20px",
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#ef4444",
                marginBottom: 8,
              }}
            >
              Danger zone
            </div>
            <div style={{ fontSize: 13, color: c.subtext, marginBottom: 14 }}>
              Clear onboarding state stored locally on this device.
            </div>
            <button
              onClick={() => {
                if (confirm("Clear local data?")) {
                  localStorage.removeItem("engram_profile");
                  localStorage.removeItem("engram_onboarded");
                  localStorage.removeItem("engram_first_saved");
                  window.location.reload();
                }
              }}
              style={{
                padding: "9px 18px",
                borderRadius: 12,
                border: `1.5px solid ${c.dangerBtnBorder}`,
                background: c.dangerBtn,
                fontSize: 13,
                fontWeight: 600,
                color: "#ef4444",
                cursor: "pointer",
              }}
            >
              Clear local data
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}
