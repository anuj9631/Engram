export default function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const scale = size === "sm" ? 0.7 : size === "lg" ? 1.3 : 1;

  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: `${10 * scale}px` }}
    >
      {/* Circuit-E SVG mark */}
      <svg
        width={40 * scale}
        height={40 * scale}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background pill */}
        <rect width="40" height="40" rx="10" fill="#7c3aed" />

        {/* E horizontal bars */}
        <rect x="10" y="10" width="18" height="4" rx="2" fill="white" />
        <rect
          x="10"
          y="18"
          width="13"
          height="4"
          rx="2"
          fill="white"
          opacity={0.85}
        />
        <rect x="10" y="26" width="18" height="4" rx="2" fill="white" />

        {/* E vertical bar */}
        <rect x="10" y="10" width="4" height="20" rx="2" fill="white" />

        {/* Circuit dots — endpoints */}
        <circle cx="28" cy="12" r="2.5" fill="#c4b5fd" />
        <circle cx="23" cy="20" r="2.5" fill="#c4b5fd" />
        <circle cx="28" cy="28" r="2.5" fill="#c4b5fd" />
      </svg>

      {/* Wordmark */}
      <div>
        <span
          style={{
            fontSize: `${18 * scale}px`,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "inherit",
            lineHeight: 1,
          }}
        >
          Engram
        </span>
      </div>
    </div>
  );
}
