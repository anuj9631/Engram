"use client";
import { useState, useEffect } from "react";

type Step = 1 | 2 | 3;

const STEPS = [
  {
    num: 1,
    emoji: "🎯",
    title: "What are your goals?",
    sub: "Engram learns from you and surfaces what matters most.",
    color: "from-violet-500 to-purple-600",
    light: "#f5f3ff",
    accent: "#7c3aed",
  },
  {
    num: 2,
    emoji: "🧠",
    title: "Add your first memory",
    sub: "Type anything — an idea, a note, something you learned today.",
    color: "from-pink-500 to-rose-500",
    light: "#fdf2f8",
    accent: "#ec4899",
  },
  {
    num: 3,
    emoji: "✨",
    title: "Ask your first question",
    sub: "See Engram in action — ask anything about what you just added.",
    color: "from-emerald-500 to-teal-500",
    light: "#f0fdf4",
    accent: "#10b981",
  },
];

const GOAL_OPTIONS = [
  {
    id: "student",
    emoji: "📚",
    label: "Student",
    desc: "Study notes & exam prep",
  },
  {
    id: "dev",
    emoji: "💻",
    label: "Developer",
    desc: "Code snippets & learnings",
  },
  {
    id: "researcher",
    emoji: "🔬",
    label: "Researcher",
    desc: "Papers & research notes",
  },
  {
    id: "creator",
    emoji: "🎨",
    label: "Creator",
    desc: "Ideas & creative projects",
  },
  {
    id: "founder",
    emoji: "🚀",
    label: "Founder",
    desc: "Business ideas & strategy",
  },
  {
    id: "general",
    emoji: "🧠",
    label: "General learning",
    desc: "Everything & anything",
  },
];

const HINT_QUESTIONS = [
  "What did I just add?",
  "What are my goals?",
  "Give me a summary of my notes",
  "What should I focus on?",
];

type Props = {
  userId: string;
  onDone: () => void;
};

export default function Onboarding({ userId, onDone }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [goals, setGoals] = useState<string[]>([]);
  const [memory, setMemory] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [saving, setSaving] = useState(false);
  const [asking, setAsking] = useState(false);
  const [memorySaved, setMemorySaved] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  // Animate progress bar
  useEffect(() => {
    const target = step === 1 ? 33 : step === 2 ? 66 : 100;
    const timer = setTimeout(() => setProgress(target), 100);
    return () => clearTimeout(timer);
  }, [step]);

  const toggleGoal = (id: string) => {
    setGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    );
  };

  const saveMemory = async () => {
    if (!memory.trim() || saving) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": userId },
        body: JSON.stringify({
          title: "My first memory",
          content: memory.trim(),
          source_type: "note",
          tags: goals.length > 0 ? goals : ["onboarding"],
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setMemorySaved(true);
      setTimeout(() => setStep(3), 800);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const askQuestion = async (q?: string) => {
    const query = (q ?? question).trim();
    if (!query || asking) return;
    setQuestion(query);
    setAsking(true);
    setAnswer("");
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": userId },
        body: JSON.stringify({ question: query }),
      });
      const data = await res.json();
      setAnswer(data.answer || "No answer found.");
    } catch {
      setAnswer("Could not get an answer. Make sure your API keys are set up.");
    } finally {
      setAsking(false);
    }
  };

  const current = STEPS[step - 1];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(15,10,30,0.7)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 28,
          width: "100%",
          maxWidth: 480,
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.2)",
          animation: "fadeUp 0.4s ease both",
        }}
      >
        {/* Progress bar */}
        <div style={{ height: 4, background: "#f1f5f9" }}>
          <div
            style={{
              height: "100%",
              width: progress + "%",
              background: `linear-gradient(90deg, #7c3aed, #4f46e5)`,
              transition: "width 0.5s ease",
            }}
          />
        </div>

        {/* Header */}
        <div
          style={{
            background: `linear-gradient(135deg, ${current.color.split(" ")[1]}, ${current.color.split(" ")[3]})`,
            padding: "28px 32px 24px",
          }}
          className={"bg-gradient-to-br " + current.color}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              marginBottom: 14,
            }}
          >
            {current.emoji}
          </div>
          <div
            style={{
              color: "white",
              fontWeight: 800,
              fontSize: 20,
              letterSpacing: "-0.02em",
              marginBottom: 6,
            }}
          >
            {current.title}
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            {current.sub}
          </div>

          {/* Step indicators */}
          <div style={{ display: "flex", gap: 6, marginTop: 20 }}>
            {STEPS.map((s) => (
              <div
                key={s.num}
                style={{
                  height: 4,
                  flex: 1,
                  borderRadius: 2,
                  background:
                    s.num <= step
                      ? "rgba(255,255,255,0.9)"
                      : "rgba(255,255,255,0.3)",
                  transition: "background 0.3s",
                }}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "24px 32px 28px" }}>
          {/* ── Step 1: Goals ── */}
          {step === 1 && (
            <div>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 14 }}>
                Pick all that apply — Engram personalizes to your needs:
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                  marginBottom: 20,
                }}
              >
                {GOAL_OPTIONS.map((g) => {
                  const selected = goals.includes(g.id);
                  return (
                    <button
                      key={g.id}
                      onClick={() => toggleGoal(g.id)}
                      style={{
                        padding: "12px 14px",
                        borderRadius: 14,
                        border: selected
                          ? "2px solid #7c3aed"
                          : "2px solid #e2e8f0",
                        background: selected ? "#f5f3ff" : "#fafafa",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.15s",
                      }}
                    >
                      <div style={{ fontSize: 18, marginBottom: 4 }}>
                        {g.emoji}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: selected ? "#7c3aed" : "#0f172a",
                        }}
                      >
                        {g.label}
                      </div>
                      <div
                        style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}
                      >
                        {g.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setStep(2)}
                style={{
                  width: "100%",
                  padding: "13px 0",
                  borderRadius: 14,
                  border: "none",
                  background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(124,58,237,0.3)",
                }}
              >
                {goals.length > 0
                  ? `Continue with ${goals.length} goal${goals.length > 1 ? "s" : ""} →`
                  : "Skip for now →"}
              </button>
            </div>
          )}

          {/* ── Step 2: First memory ── */}
          {step === 2 && (
            <div>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>
                Write anything — a thought, idea, or something you want to
                remember:
              </div>
              <textarea
                value={memory}
                onChange={(e) => setMemory(e.target.value)}
                placeholder="e.g. Today I learned that vector embeddings capture semantic meaning, not just keywords. This is how Engram finds relevant memories..."
                rows={5}
                autoFocus
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: 14,
                  border: "2px solid #e2e8f0",
                  fontSize: 14,
                  outline: "none",
                  resize: "none",
                  lineHeight: 1.6,
                  color: "#0f172a",
                  fontFamily: "inherit",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box",
                  marginBottom: 12,
                }}
                onFocus={(e) => (e.target.style.borderColor = "#a78bfa")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              />
              {error && (
                <div
                  style={{ color: "#ef4444", fontSize: 12, marginBottom: 10 }}
                >
                  {error}
                </div>
              )}
              <button
                onClick={saveMemory}
                disabled={!memory.trim() || saving}
                style={{
                  width: "100%",
                  padding: "13px 0",
                  borderRadius: 14,
                  border: "none",
                  background: memorySaved
                    ? "linear-gradient(135deg, #10b981, #059669)"
                    : "linear-gradient(135deg, #ec4899, #be185d)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: !memory.trim() || saving ? "not-allowed" : "pointer",
                  opacity: !memory.trim() || saving ? 0.6 : 1,
                  boxShadow: "0 4px 16px rgba(236,72,153,0.3)",
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
                    Saving your memory...
                  </>
                ) : memorySaved ? (
                  <>
                    <span>✓</span> Memory saved! Moving on...
                  </>
                ) : (
                  <>
                    <span>🧠</span> Save my first memory
                  </>
                )}
              </button>

              <button
                onClick={() => setStep(1)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#94a3b8",
                  fontSize: 13,
                  cursor: "pointer",
                  marginTop: 12,
                  width: "100%",
                }}
              >
                ← Back
              </button>
            </div>
          )}

          {/* ── Step 3: Ask a question ── */}
          {step === 3 && (
            <div>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>
                Ask Engram anything about what you just added:
              </div>

              {/* Hint chips */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  marginBottom: 14,
                }}
              >
                {HINT_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => askQuestion(q)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 20,
                      border: "1.5px solid #e2e8f0",
                      background: "#fafafa",
                      fontSize: 12,
                      color: "#7c3aed",
                      cursor: "pointer",
                      fontWeight: 500,
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f5f3ff";
                      e.currentTarget.style.borderColor = "#a78bfa";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fafafa";
                      e.currentTarget.style.borderColor = "#e2e8f0";
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && askQuestion()}
                  placeholder="Ask anything..."
                  style={{
                    flex: 1,
                    padding: "11px 16px",
                    borderRadius: 14,
                    border: "2px solid #e2e8f0",
                    fontSize: 13,
                    outline: "none",
                    color: "#0f172a",
                    fontFamily: "inherit",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#a78bfa")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
                <button
                  onClick={() => askQuestion()}
                  disabled={!question.trim() || asking}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    border: "none",
                    background:
                      question.trim() && !asking
                        ? "linear-gradient(135deg, #7c3aed, #4f46e5)"
                        : "#e2e8f0",
                    color: question.trim() && !asking ? "white" : "#94a3b8",
                    cursor:
                      question.trim() && !asking ? "pointer" : "not-allowed",
                    fontSize: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {asking ? (
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        border: "2px solid rgba(255,255,255,0.4)",
                        borderTop: "2px solid white",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                      }}
                    />
                  ) : (
                    "↑"
                  )}
                </button>
              </div>

              {/* Answer */}
              {answer && (
                <div
                  style={{
                    background: "#f5f3ff",
                    border: "1.5px solid #ede9fe",
                    borderRadius: 14,
                    padding: "14px 16px",
                    marginBottom: 14,
                    animation: "fadeUp 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#7c3aed",
                      marginBottom: 6,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Engram answered
                  </div>
                  <div
                    style={{ fontSize: 13, color: "#1e293b", lineHeight: 1.6 }}
                  >
                    {answer}
                  </div>
                </div>
              )}

              {/* Done button */}
              <button
                onClick={onDone}
                style={{
                  width: "100%",
                  padding: "13px 0",
                  borderRadius: 14,
                  border: "none",
                  background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(124,58,237,0.3)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-1px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                {answer ? "Go to dashboard →" : "Skip and go to dashboard →"}
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
