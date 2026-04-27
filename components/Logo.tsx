export default function Logo({
  size = "md",
  white = false,
}: {
  size?: "sm" | "md" | "lg"
  white?: boolean
}) {
  const dim = size === "sm" ? 32 : size === "lg" ? 48 : 38
  const fs  = size === "sm" ? 16 : size === "lg" ? 24 : 20

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width={dim} height={dim} viewBox="0 0 40 40" fill="none">
        {/* Gradient background */}
        <defs>
          <linearGradient id="eg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="11" fill="url(#eg)" />

        {/* Subtle inner glow */}
        <rect width="40" height="40" rx="11" fill="white" opacity="0.06" />

        {/* E — vertical spine */}
        <rect x="11" y="10" width="4" height="20" rx="2" fill="white" />

        {/* E — top bar */}
        <rect x="11" y="10" width="17" height="4" rx="2" fill="white" />

        {/* E — middle bar (shorter) */}
        <rect x="11" y="18" width="12" height="4" rx="2" fill="white" opacity="0.85" />

        {/* E — bottom bar */}
        <rect x="11" y="26" width="17" height="4" rx="2" fill="white" />

        {/* Circuit endpoint dots */}
        <circle cx="28" cy="12" r="2.8" fill="#c4b5fd" />
        <circle cx="23" cy="20" r="2.8" fill="#a5b4fc" />
        <circle cx="28" cy="28" r="2.8" fill="#c4b5fd" />

        {/* Tiny pulse ring on top dot */}
        <circle cx="28" cy="12" r="5" fill="#c4b5fd" opacity="0.2" />
      </svg>

      <span
        style={{
          fontSize: fs,
          fontWeight: 800,
          letterSpacing: "-0.04em",
          color: white ? "#ffffff" : "#0f172a",
          lineHeight: 1,
        }}
      >
        Engram
      </span>
    </div>
  )
}
