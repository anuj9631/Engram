"use client"
import { useState, useRef, useEffect } from "react"

type Message = {
  role: "user" | "ai"
  text: string
}

const SUGGESTIONS = [
  "What is Engram?",
  "How does memory search work?",
  "Is it free to use?",
  "How is this different from Notion?",
]

const BOT_ANSWERS: Record<string, string> = {
  default:
    "Great question! Engram is your AI-powered second brain. Add notes, ideas, and docs — then ask questions and get answers from your own memory. Want to know more?",
  "what is engram":
    "Engram is a personal AI memory OS. You add your notes, ideas, and documents — and Engram remembers everything. Ask it anything and it retrieves answers from your own knowledge. Think of it as a genius assistant that only knows *you*.",
  "how does memory search work":
    "Engram converts every memory into a semantic vector using AI embeddings. When you ask a question, it finds the most relevant memories using cosine similarity — meaning it understands *meaning*, not just keywords. Results in under 1 second.",
  "is it free to use":
    "Yes! Engram is free forever for personal use. No credit card needed. Just sign up and start building your second brain instantly.",
  "how is this different from notion":
    "Notion stores documents. Engram *understands* them. You can ask Engram 'What were my best project ideas last month?' and get a real answer — Notion can't do that. Engram thinks with you, not just stores for you.",
}

function getAnswer(q: string): string {
  const key = q.toLowerCase().trim().replace(/[?!.]/g, "")
  for (const k of Object.keys(BOT_ANSWERS)) {
    if (k !== "default" && key.includes(k)) return BOT_ANSWERS[k]
  }
  return BOT_ANSWERS["default"]
}

export default function AiChatBot() {
  const [open,     setOpen]     = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [input,    setInput]    = useState("")
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Hi! I'm Engram AI 👋 Ask me anything about how Engram works, or try one of the suggestions below." },
  ])
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typing])

  // Auto-open after 4 seconds
  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 4000)
    return () => clearTimeout(t)
  }, [])

  const sendMessage = async (text: string) => {
    if (!text.trim()) return
    const q = text.trim()
    setInput("")
    setMessages(prev => [...prev, { role: "user", text: q }])
    setTyping(true)
    await new Promise(r => setTimeout(r, 900 + Math.random() * 600))
    setTyping(false)
    setMessages(prev => [...prev, { role: "ai", text: getAnswer(q) }])
  }

  const chatW = expanded ? 420 : 340
  const chatH = expanded ? 560 : 420

  return (
    <>
      {/* ── Floating bubble ── */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            bottom: 28,
            right: 28,
            zIndex: 200,
            width: 60,
            height: 60,
            borderRadius: "50%",
            border: "none",
            background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
            boxShadow: "0 8px 32px rgba(124,58,237,0.45)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s, box-shadow 0.2s",
            animation: "float 3s ease-in-out infinite",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "scale(1.1)"
            e.currentTarget.style.boxShadow = "0 12px 40px rgba(124,58,237,0.55)"
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "scale(1)"
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(124,58,237,0.45)"
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" fill="white" opacity="0.9"/>
            <circle cx="8.5"  cy="12" r="1.2" fill="#7c3aed"/>
            <circle cx="12"   cy="12" r="1.2" fill="#7c3aed"/>
            <circle cx="15.5" cy="12" r="1.2" fill="#7c3aed"/>
          </svg>
          {/* Pulse ring */}
          <span style={{
            position: "absolute",
            inset: -4,
            borderRadius: "50%",
            border: "2px solid rgba(124,58,237,0.4)",
            animation: "pulse-ring 2s ease-out infinite",
          }} />
        </button>
      )}

      {/* ── Chat window ── */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 28,
            right: 28,
            zIndex: 200,
            width: chatW,
            height: chatH,
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: "0 24px 80px rgba(15,23,42,0.2), 0 0 0 1px rgba(124,58,237,0.12)",
            display: "flex",
            flexDirection: "column",
            background: "#fff",
            transition: "width 0.3s ease, height 0.3s ease",
            animation: "fadeUp 0.3s ease both",
          }}
        >
          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
          }}>
            {/* Avatar */}
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="8" fill="rgba(255,255,255,0.15)" />
                <rect x="11" y="10" width="4"  height="20" rx="2" fill="white" />
                <rect x="11" y="10" width="17" height="4"  rx="2" fill="white" />
                <rect x="11" y="18" width="12" height="4"  rx="2" fill="white" opacity="0.8" />
                <rect x="11" y="26" width="17" height="4"  rx="2" fill="white" />
                <circle cx="28" cy="12" r="2.5" fill="#c4b5fd" />
                <circle cx="23" cy="20" r="2.5" fill="#a5b4fc" />
                <circle cx="28" cy="28" r="2.5" fill="#c4b5fd" />
              </svg>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ color: "white", fontWeight: 700, fontSize: 14, lineHeight: 1 }}>Engram AI</div>
              <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
                Online · Ask me anything
              </div>
            </div>

            {/* Expand button */}
            <button
              onClick={() => setExpanded(!expanded)}
              title={expanded ? "Shrink" : "Expand"}
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                border: "none",
                background: "rgba(255,255,255,0.15)",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                flexShrink: 0,
                transition: "background 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
            >
              {expanded ? "⊡" : "⊞"}
            </button>

            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              title="Close"
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                border: "none",
                background: "rgba(255,255,255,0.15)",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
                fontWeight: 300,
                flexShrink: 0,
                transition: "background 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.4)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "14px 14px 8px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            background: "#fafafa",
          }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  gap: 8,
                  alignItems: "flex-end",
                }}
              >
                {msg.role === "ai" && (
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                  }}>
                    ✦
                  </div>
                )}
                <div style={{
                  maxWidth: "80%",
                  padding: "10px 13px",
                  borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  background: msg.role === "user"
                    ? "linear-gradient(135deg,#7c3aed,#4f46e5)"
                    : "#fff",
                  color: msg.role === "user" ? "white" : "#1e293b",
                  fontSize: 13,
                  lineHeight: 1.55,
                  boxShadow: msg.role === "user"
                    ? "0 4px 12px rgba(124,58,237,0.25)"
                    : "0 2px 8px rgba(0,0,0,0.06)",
                  border: msg.role === "ai" ? "1px solid #f1f5f9" : "none",
                }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
                }}>
                  ✦
                </div>
                <div style={{
                  padding: "10px 14px",
                  borderRadius: "18px 18px 18px 4px",
                  background: "#fff",
                  border: "1px solid #f1f5f9",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  display: "flex",
                  gap: 4,
                  alignItems: "center",
                }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: "#a78bfa",
                      display: "inline-block",
                      animation: "bounce 1.2s ease-in-out infinite",
                      animationDelay: i * 0.2 + "s",
                    }} />
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions — only show at start */}
            {messages.length === 1 && !typing && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    style={{
                      padding: "6px 11px",
                      borderRadius: 20,
                      border: "1px solid #e2e8f0",
                      background: "#fff",
                      fontSize: 12,
                      color: "#7c3aed",
                      cursor: "pointer",
                      fontWeight: 500,
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "#f5f3ff"
                      e.currentTarget.style.borderColor = "#a78bfa"
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "#fff"
                      e.currentTarget.style.borderColor = "#e2e8f0"
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <div style={{
            padding: "10px 12px",
            borderTop: "1px solid #f1f5f9",
            display: "flex",
            gap: 8,
            background: "#fff",
            flexShrink: 0,
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage(input)}
              placeholder="Ask about Engram..."
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: 14,
                border: "1.5px solid #e2e8f0",
                fontSize: 13,
                outline: "none",
                transition: "border-color 0.2s",
                color: "#0f172a",
                background: "#fafafa",
              }}
              onFocus={e => e.target.style.borderColor = "#a78bfa"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || typing}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                border: "none",
                background: input.trim() && !typing
                  ? "linear-gradient(135deg,#7c3aed,#4f46e5)"
                  : "#e2e8f0",
                color: input.trim() && !typing ? "white" : "#94a3b8",
                cursor: input.trim() && !typing ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: 16,
                transition: "all 0.2s",
              }}
            >
              ↑
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40%            { transform: translateY(-6px); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(1.5); opacity: 0;   }
        }
      `}</style>
    </>
  )
}
