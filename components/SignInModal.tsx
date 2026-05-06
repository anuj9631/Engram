"use client";
import { useState } from "react";
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
} from "@/lib/supabase";

type Props = { onClose: () => void };

function Logo({ white = false }: { white?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
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
      <span
        style={{
          fontSize: 20,
          fontWeight: 800,
          letterSpacing: "-0.03em",
          color: white ? "#fff" : "#111827",
        }}
      >
        Engram
      </span>
    </div>
  );
}

export default function SignInModal({ onClose }: Props) {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    if (tab === "signup" && !name.trim()) {
      setError("Please enter your name");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    if (tab === "signin") {
      const { data, error } = await signInWithEmail(email, password);
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      if (data.user) {
        window.location.href = "/dashboard";
      }
    } else {
      const { data, error } = await signUpWithEmail(email, password, name);
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      if (data.user) {
        // Check if email confirmation is required
        if (!data.session) {
          setSuccess("Check your email for a confirmation link!");
          setLoading(false);
          return;
        }
        window.location.href = "/dashboard";
      }
    }

    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error.message);
      setLoading(false);
    }
    // Google redirects automatically — no need to handle success here
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(15,10,30,0.6)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 28,
          width: "100%",
          maxWidth: 440,
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(124,58,237,0.18)",
          animation: "fadeUp 0.3s ease both",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
            padding: "28px 32px 24px",
            position: "relative",
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              width: 32,
              height: 32,
              borderRadius: 10,
              background: "rgba(255,255,255,0.15)",
              border: "none",
              color: "white",
              cursor: "pointer",
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
          <div style={{ marginBottom: 14 }}>
            <Logo white />
          </div>
          <div style={{ color: "white", fontWeight: 800, fontSize: 20 }}>
            {tab === "signin" ? "Welcome back 👋" : "Join Engram 🚀"}
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: 13,
              marginTop: 4,
            }}
          >
            {tab === "signin"
              ? "Sign in to your second brain"
              : "Start remembering everything"}
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", borderBottom: "1px solid #f1f5f9" }}>
          {(["signin", "signup"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setError("");
                setSuccess("");
              }}
              style={{
                flex: 1,
                padding: "14px 0",
                fontSize: 13,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                background: tab === t ? "#fff" : "#f8fafc",
                color: tab === t ? "#7c3aed" : "#94a3b8",
                borderBottom:
                  tab === t ? "2px solid #7c3aed" : "2px solid transparent",
                transition: "all 0.2s",
              }}
            >
              {t === "signin" ? "Sign in" : "Sign up"}
            </button>
          ))}
        </div>

        {/* Form */}
        <div style={{ padding: "24px 32px 28px" }}>
          {/* Google button */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "11px 0",
              borderRadius: 14,
              border: "2px solid #e2e8f0",
              background: "#fff",
              fontSize: 13,
              fontWeight: 600,
              color: "#334155",
              cursor: loading ? "not-allowed" : "pointer",
              marginBottom: 20,
              transition: "all 0.2s",
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "#a78bfa")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "#e2e8f0")
            }
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path
                fill="#FFC107"
                d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
              />
              <path
                fill="#FF3D00"
                d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.021 35.596 44 30.138 44 24c0-1.341-.138-2.65-.389-3.917z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <div style={{ flex: 1, height: 1, background: "#f1f5f9" }} />
            <span style={{ fontSize: 12, color: "#94a3b8" }}>
              or with email
            </span>
            <div style={{ flex: 1, height: 1, background: "#f1f5f9" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {tab === "signup" && (
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
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Arjun Sharma"
                  style={{
                    width: "100%",
                    padding: "11px 16px",
                    borderRadius: 14,
                    border: "2px solid #e2e8f0",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                    color: "#0f172a",
                    fontFamily: "inherit",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#a78bfa")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </div>
            )}

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
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="you@example.com"
                style={{
                  width: "100%",
                  padding: "11px 16px",
                  borderRadius: 14,
                  border: "2px solid #e2e8f0",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                  color: "#0f172a",
                  fontFamily: "inherit",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#a78bfa")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              />
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <label
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Password
                </label>
                {tab === "signin" && (
                  <button
                    onClick={async () => {
                      if (!email) {
                        setError("Enter your email first");
                        return;
                      }
                      const { error } =
                        await supabase.auth.resetPasswordForEmail(email);
                      if (error) setError(error.message);
                      else setSuccess("Password reset email sent!");
                    }}
                    style={{
                      fontSize: 12,
                      color: "#7c3aed",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "11px 16px",
                  borderRadius: 14,
                  border: "2px solid #e2e8f0",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                  color: "#0f172a",
                  fontFamily: "inherit",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#a78bfa")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                marginTop: 14,
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

          {/* Success */}
          {success && (
            <div
              style={{
                marginTop: 14,
                padding: "10px 14px",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: 12,
                fontSize: 13,
                color: "#15803d",
              }}
            >
              ✓ {success}
            </div>
          )}

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              marginTop: 20,
              width: "100%",
              padding: "13px 0",
              borderRadius: 14,
              border: "none",
              background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
              color: "white",
              fontWeight: 700,
              fontSize: 14,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              boxShadow: "0 4px 20px rgba(124,58,237,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "all 0.2s",
            }}
          >
            {loading ? (
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
                Please wait...
              </>
            ) : tab === "signin" ? (
              "Sign in to Engram →"
            ) : (
              "Create account →"
            )}
          </button>

          <p
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "#94a3b8",
              marginTop: 16,
            }}
          >
            By continuing you agree to our{" "}
            <a href="#" style={{ color: "#7c3aed" }}>
              Terms
            </a>{" "}
            and{" "}
            <a href="#" style={{ color: "#7c3aed" }}>
              Privacy Policy
            </a>
          </p>
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

// Need supabase for forgot password inline
import { supabase } from "@/lib/supabase";
