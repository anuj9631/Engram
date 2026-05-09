"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import SignInModal from "@/components/SignInModal";
import ThemeToggle from "@/components/ThemeToggle";
import { supabase, signOut } from "@/lib/supabase";

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Testimonials", href: "#testimonials" },
];

type User = {
  email: string;
  initials: string;
};

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userMenu, setUserMenu] = useState(false);

  // Check auth state on mount
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        const email = session.user.email ?? "";
        const name =
          session.user.user_metadata?.full_name || email.split("@")[0];
        const initials = name ? name[0].toUpperCase() : "U";
        setUser({ email: name, initials });
      }
    };
    checkUser();

    // Listen for login/logout changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const email = session.user.email ?? "";
        const name =
          session.user.user_metadata?.full_name || email.split("@")[0];
        const initials = name ? name[0].toUpperCase() : "U";
        setUser({ email: name, initials });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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

  // Close user menu on outside click
  useEffect(() => {
    if (!userMenu) return;
    const handler = () => setUserMenu(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [userMenu]);

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    setUserMenu(false);
    router.push("/");
  };

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
            <ThemeToggle />

            {user ? (
              /* ── Logged in state ── */
              <div style={{ position: "relative" }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserMenu(!userMenu);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "7px 14px 7px 8px",
                    borderRadius: 14,
                    border: "1.5px solid rgba(124,58,237,0.2)",
                    background: "rgba(124,58,237,0.05)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(124,58,237,0.1)";
                    e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(124,58,237,0.05)";
                    e.currentTarget.style.borderColor = "rgba(124,58,237,0.2)";
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: 13,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {user.initials}
                  </div>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#374151",
                      maxWidth: 120,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user.email}
                  </span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    style={{
                      flexShrink: 0,
                      transform: userMenu ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s",
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {userMenu && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: "absolute",
                      top: "110%",
                      right: 0,
                      minWidth: 200,
                      background: "#fff",
                      borderRadius: 16,
                      border: "1px solid #f1f5f9",
                      boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
                      overflow: "hidden",
                      animation: "fadeUp 0.15s ease",
                      zIndex: 100,
                    }}
                  >
                    {/* User info header */}
                    <div
                      style={{
                        padding: "14px 16px",
                        borderBottom: "1px solid #f1f5f9",
                        background: "#fafafa",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            background:
                              "linear-gradient(135deg, #7c3aed, #4f46e5)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: 15,
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {user.initials}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: "#0f172a",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {user.email}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "#7c3aed",
                              marginTop: 2,
                            }}
                          >
                            Signed in
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div style={{ padding: "6px 0" }}>
                      <Link
                        href="/dashboard"
                        onClick={() => setUserMenu(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "10px 16px",
                          textDecoration: "none",
                          color: "#374151",
                          fontSize: 13,
                          fontWeight: 500,
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#f5f3ff")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <span>📚</span> Go to Dashboard
                      </Link>

                      <Link
                        href="/dashboard"
                        onClick={() => setUserMenu(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "10px 16px",
                          textDecoration: "none",
                          color: "#374151",
                          fontSize: 13,
                          fontWeight: 500,
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#f5f3ff")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <span>👤</span> Profile
                      </Link>

                      <div
                        style={{
                          height: 1,
                          background: "#f1f5f9",
                          margin: "6px 0",
                        }}
                      />

                      <button
                        onClick={handleSignOut}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "10px 16px",
                          background: "none",
                          border: "none",
                          color: "#ef4444",
                          fontSize: 13,
                          fontWeight: 500,
                          cursor: "pointer",
                          width: "100%",
                          textAlign: "left",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#fef2f2")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        >
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16,17 21,12 16,7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ── Logged out state ── */
              <>
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
              </>
            )}
          </div>

          {/* Mobile right side */}
          <div
            style={{ display: "flex", alignItems: "center", gap: 8 }}
            className="show-mobile"
          >
            <ThemeToggle />

            {user ? (
              <Link href="/dashboard" style={{ textDecoration: "none" }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {user.initials}
                </div>
              </Link>
            ) : (
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
            )}
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && !user && (
          <div
            style={{
              background: "rgba(255,255,255,0.97)",
              backdropFilter: "blur(20px)",
              borderTop: "1px solid rgba(124,58,237,0.08)",
              padding: "16px 24px 24px",
            }}
          >
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
