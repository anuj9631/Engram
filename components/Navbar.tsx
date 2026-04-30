"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import SignInModal from "@/components/SignInModal";
import ThemeToggle from "@/components/ThemeToggle";
import CommandPalette from "@/components/CommandPalette";

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Testimonials", href: "#testimonials" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handle);
    return () => window.removeEventListener("scroll", handle);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showAuth ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showAuth]);

  return (
    <>
      {showAuth && <SignInModal onClose={() => setShowAuth(false)} />}

      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: "all 0.3s ease",
          background: scrolled ? "rgba(255,255,255,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(124,58,237,0.1)"
            : "1px solid transparent",
          boxShadow: scrolled ? "0 4px 30px rgba(124,58,237,0.06)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            height: 68,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{ textDecoration: "none", color: "inherit", flexShrink: 0 }}
          >
            <Logo size="md" />
          </Link>

          {/* Desktop nav links */}
          <div
            style={{ display: "flex", alignItems: "center", gap: 4 }}
            className="hide-mobile"
          >
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  padding: "8px 14px",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#475569",
                  textDecoration: "none",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#7c3aed";
                  e.currentTarget.style.background = "#f5f3ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#475569";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop right side */}
          <div
            style={{ display: "flex", alignItems: "center", gap: 10 }}
            className="hide-mobile"
          >
            {/* Command palette trigger */}
            <CommandPalette />

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Sign in */}
            <button
              onClick={() => setShowAuth(true)}
              style={{
                padding: "9px 18px",
                borderRadius: 12,
                border: "none",
                background: "transparent",
                fontSize: 14,
                fontWeight: 600,
                color: "#475569",
                cursor: "pointer",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#7c3aed";
                e.currentTarget.style.background = "#f5f3ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#475569";
                e.currentTarget.style.background = "transparent";
              }}
            >
              Sign in
            </button>

            {/* CTA */}
            <button
              onClick={() => setShowAuth(true)}
              style={{
                padding: "10px 22px",
                borderRadius: 13,
                border: "none",
                background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                fontSize: 14,
                fontWeight: 700,
                color: "white",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(124,58,237,0.35)",
                transition: "all 0.25s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(124,58,237,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 16px rgba(124,58,237,0.35)";
              }}
            >
              Get started free →
            </button>
          </div>

          {/* Mobile right side */}
          <div
            style={{ display: "flex", alignItems: "center", gap: 8 }}
            className="show-mobile"
          >
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                border: "none",
                background: menuOpen ? "#f5f3ff" : "transparent",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
                padding: 10,
                transition: "background 0.2s",
              }}
            >
              <span
                style={{
                  display: "block",
                  width: 20,
                  height: 2,
                  background: "#374151",
                  borderRadius: 2,
                  transition: "all 0.3s",
                  transform: menuOpen
                    ? "rotate(45deg) translateY(7px)"
                    : "none",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: 20,
                  height: 2,
                  background: "#374151",
                  borderRadius: 2,
                  transition: "all 0.3s",
                  opacity: menuOpen ? 0 : 1,
                }}
              />
              <span
                style={{
                  display: "block",
                  width: 20,
                  height: 2,
                  background: "#374151",
                  borderRadius: 2,
                  transition: "all 0.3s",
                  transform: menuOpen
                    ? "rotate(-45deg) translateY(-7px)"
                    : "none",
                }}
              />
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div
            style={{
              background: "rgba(255,255,255,0.97)",
              backdropFilter: "blur(20px)",
              borderTop: "1px solid rgba(124,58,237,0.08)",
              padding: "16px 24px 24px",
            }}
          >
            {/* Mobile search */}
            <div style={{ marginBottom: 12 }}>
              <CommandPalette />
            </div>

            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block",
                  padding: "13px 0",
                  fontSize: 15,
                  fontWeight: 500,
                  color: "#374151",
                  textDecoration: "none",
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                {link.label}
              </a>
            ))}

            <button
              onClick={() => {
                setMenuOpen(false);
                setShowAuth(true);
              }}
              style={{
                marginTop: 16,
                width: "100%",
                padding: "14px 0",
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
              Get started free →
            </button>
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .hide-mobile { display: flex !important; }
          .show-mobile { display: none !important; }
        }
        .dark nav {
          background: rgba(15,10,30,0.88) !important;
          border-bottom-color: rgba(124,58,237,0.15) !important;
        }
      `}</style>
    </>
  );
}
