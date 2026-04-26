"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

const FEATURES = [
  {
    icon: "🧠",
    title: "Universal Memory",
    desc: "Capture notes, ideas, docs, conversations. Everything stored as structured searchable memory.",
    gradient: "from-violet-500/10 to-purple-500/5",
    border: "border-violet-200/60",
    iconBg: "bg-violet-100",
  },
  {
    icon: "✨",
    title: "Context-Aware AI",
    desc: "Ask anything in plain English. Engram searches your memory semantically and gives precise cited answers.",
    gradient: "from-pink-500/10 to-rose-500/5",
    border: "border-pink-200/60",
    iconBg: "bg-pink-100",
  },
  {
    icon: "🎯",
    title: "Predictive Thinking",
    desc: "Preparing for an interview? Engram surfaces your relevant experience and suggests improvements automatically.",
    gradient: "from-sky-500/10 to-blue-500/5",
    border: "border-sky-200/60",
    iconBg: "bg-sky-100",
  },
  {
    icon: "📈",
    title: "Personal Growth",
    desc: "Tracks your goals, habits and strengths over time. Becomes smarter the more you use it.",
    gradient: "from-emerald-500/10 to-teal-500/5",
    border: "border-emerald-200/60",
    iconBg: "bg-emerald-100",
  },
  {
    icon: "🔒",
    title: "Fully Private",
    desc: "Your memories belong only to you. End-to-end encryption, zero data sharing, always.",
    gradient: "from-amber-500/10 to-orange-500/5",
    border: "border-amber-200/60",
    iconBg: "bg-amber-100",
  },
  {
    icon: "⚡",
    title: "Instant Search",
    desc: "Vector-powered semantic search finds what you mean, not just what you typed. Under a second.",
    gradient: "from-indigo-500/10 to-violet-500/5",
    border: "border-indigo-200/60",
    iconBg: "bg-indigo-100",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Add a memory",
    desc: "Type a note, paste an idea, upload a doc. Engram stores it instantly with full context.",
  },
  {
    num: "02",
    title: "AI understands it",
    desc: "Every memory is converted into a semantic vector — capturing meaning, not just keywords.",
  },
  {
    num: "03",
    title: "Ask anything",
    desc: "Ask in plain English. Engram retrieves the exact memories and crafts a precise answer.",
  },
];

const TESTIMONIALS = [
  {
    name: "Arjun Sharma",
    role: "Software Engineer",
    avatar: "AS",
    color: "from-violet-400 to-purple-600",
    quote:
      "Engram changed how I prepare for interviews. It surfaces exactly what I worked on — I stopped forgetting my own projects.",
  },
  {
    name: "Priya Nair",
    role: "ML Researcher",
    avatar: "PN",
    color: "from-pink-400 to-rose-600",
    quote:
      "I dump all my research notes into Engram. When I need to write a paper, I just ask — it connects ideas I forgot I had.",
  },
  {
    name: "Rohit Verma",
    role: "CS Student",
    avatar: "RV",
    color: "from-sky-400 to-blue-600",
    quote:
      "Like having a personal search engine for my brain. It actually understands what I mean when I ask questions.",
  },
];

const STATS = [
  { value: "10x", label: "Faster recall" },
  { value: "100%", label: "Private & secure" },
  { value: "< 1s", label: "Search speed" },
  { value: "∞", label: "Memories stored" },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeT, setActiveT] = useState(0);
  const featRef = useReveal();
  const howRef = useReveal();
  const testRef = useReveal();
  const ctaRef = useReveal();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const t = setInterval(
      () => setActiveT((a) => (a + 1) % TESTIMONIALS.length),
      4000,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <main className="overflow-x-hidden">
      {/* ── NAVBAR ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass shadow-lg shadow-violet-100/50" : "bg-transparent"}`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧠</span>
            <span className="font-bold text-xl text-gray-900 tracking-tight">
              Engram
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["Features", "How it works", "Testimonials"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="text-sm text-gray-600 hover:text-violet-600 transition-colors font-medium"
              >
                {item}
              </a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-gray-600 hover:text-violet-600 px-4 py-2 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/dashboard"
              className="btn-primary text-white text-sm font-bold px-5 py-2.5 rounded-xl"
            >
              Get started free →
            </Link>
          </div>
          <button
            className="md:hidden text-gray-700 text-xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden glass border-t border-white/30 px-6 py-4 space-y-3">
            {["Features", "How it works", "Testimonials"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="block text-sm text-gray-700 py-1"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <Link
              href="/dashboard"
              className="block btn-primary text-white text-sm font-bold px-5 py-2.5 rounded-xl text-center mt-2"
            >
              Get started free →
            </Link>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen gradient-bg flex items-center overflow-hidden pt-16">
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-300/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300/25 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-200/20 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center w-full">
          <div>
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-violet-700 font-medium mb-6 animate-fade-up shadow-sm">
              <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
              AI-powered personal memory OS
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6 animate-fade-up delay-100">
              Your second brain,{" "}
              <span className="shimmer-text">finally built.</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg animate-fade-up delay-200">
              Engram captures everything you know, think, and learn — then lets
              you ask questions and get answers from your own memory. Like a
              genius assistant that only knows <em>you</em>.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-up delay-300">
              <Link
                href="/dashboard"
                className="btn-primary text-white font-bold px-8 py-4 rounded-2xl text-base"
              >
                Start for free — it's instant
              </Link>
              <a
                href="#how-it-works"
                className="glass text-gray-700 font-semibold px-8 py-4 rounded-2xl text-base hover:bg-white/90 transition-all shadow-sm"
              >
                See how it works
              </a>
            </div>
            <p className="text-xs text-gray-400 mt-4 animate-fade-up delay-400">
              No credit card needed · Free forever for personal use
            </p>
          </div>

          {/* Floating UI preview */}
          <div className="animate-fade-up delay-300 relative">
            <div className="animate-float">
              <div className="glass rounded-3xl p-6 shadow-2xl shadow-violet-200/40">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-xs text-gray-400 ml-2 font-mono">
                    engram.app/dashboard
                  </span>
                </div>
                <div className="bg-white/80 rounded-2xl p-4 mb-3 border border-violet-100/60">
                  <div className="flex items-center gap-2 mb-2">
                    <span>💡</span>
                    <span className="text-sm font-semibold text-gray-800">
                      RAG system idea
                    </span>
                    <span className="ml-auto text-xs bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full">
                      idea
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Use pgvector cosine similarity to retrieve top-k relevant
                    memories before sending to LLM...
                  </p>
                </div>
                <div className="bg-gradient-to-br from-violet-50 to-pink-50 rounded-2xl p-4 border border-violet-100/60">
                  <p className="text-xs text-violet-500 font-semibold mb-2">
                    ✨ Engram answered
                  </p>
                  <p className="text-sm font-semibold text-gray-800 mb-2">
                    "What do I know about vector databases?"
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Based on your notes, you explored pgvector and noted cosine
                    similarity works better than Euclidean for text
                    embeddings...
                  </p>
                  <div className="flex gap-2 mt-3">
                    <span className="text-xs bg-white text-violet-600 px-2 py-1 rounded-lg border border-violet-200 font-medium">
                      94% match
                    </span>
                    <span className="text-xs bg-white text-violet-600 px-2 py-1 rounded-lg border border-violet-200 font-medium">
                      2 sources
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl px-4 py-2 shadow-xl border border-violet-100">
                <div className="flex items-center gap-2">
                  <span>🎯</span>
                  <span className="text-xs font-semibold text-gray-700">
                    Memory saved!
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 glass rounded-2xl px-4 py-2 shadow-lg">
                <div className="flex items-center gap-2">
                  <span>⚡</span>
                  <span className="text-xs font-semibold text-gray-700">
                    0.3s search
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 glass border-t border-white/40">
          <div className="max-w-6xl mx-auto px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-black text-violet-600">
                  {s.value}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 bg-white" ref={featRef.ref}>
        <div className="max-w-6xl mx-auto px-6">
          <div
            className={`text-center mb-16 transition-all duration-700 ${featRef.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <span className="inline-block text-sm font-semibold text-violet-600 bg-violet-50 px-4 py-1.5 rounded-full mb-4">
              Everything you need
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              Built different, by design
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Not another note app. Engram is an AI that thinks with your own
              knowledge.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`card-hover bg-gradient-to-br ${f.gradient} border ${f.border} rounded-3xl p-6 transition-all duration-700 ${featRef.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div
                  className={`w-12 h-12 ${f.iconBg} rounded-2xl flex items-center justify-center text-2xl mb-4`}
                >
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 gradient-bg" ref={howRef.ref}>
        <div className="max-w-6xl mx-auto px-6">
          <div
            className={`text-center mb-16 transition-all duration-700 ${howRef.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <span className="inline-block text-sm font-semibold text-violet-600 bg-white/70 px-4 py-1.5 rounded-full mb-4">
              Simple as breathing
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              How Engram works
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Three steps. No learning curve. Just your memory, amplified.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                className={`relative transition-all duration-700 ${howRef.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-violet-300 to-transparent z-0" />
                )}
                <div className="glass rounded-3xl p-8 shadow-lg shadow-violet-100/30 card-hover relative z-10">
                  <div className="text-4xl font-black shimmer-text mb-4">
                    {step.num}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="py-24 bg-white" ref={testRef.ref}>
        <div className="max-w-6xl mx-auto px-6">
          <div
            className={`text-center mb-16 transition-all duration-700 ${testRef.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <span className="inline-block text-sm font-semibold text-violet-600 bg-violet-50 px-4 py-1.5 rounded-full mb-4">
              Loved by builders
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              What early users say
            </h2>
          </div>
          {/* Mobile carousel */}
          <div className="relative max-w-2xl mx-auto lg:hidden">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className={`transition-all duration-500 ${i === activeT ? "opacity-100 block" : "opacity-0 hidden"}`}
              >
                <div className="bg-gradient-to-br from-violet-50 to-pink-50 border border-violet-100 rounded-3xl p-8 text-center shadow-xl">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${t.color} rounded-2xl flex items-center justify-center text-white font-bold text-lg mx-auto mb-4`}
                  >
                    {t.avatar}
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6 italic">
                    "{t.quote}"
                  </p>
                  <p className="font-bold text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
            <div className="flex justify-center gap-2 mt-6">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveT(i)}
                  className={`transition-all duration-300 rounded-full ${i === activeT ? "w-8 h-2.5 bg-violet-600" : "w-2.5 h-2.5 bg-violet-200"}`}
                />
              ))}
            </div>
          </div>
          {/* Desktop all 3 */}
          <div className="hidden lg:grid grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className={`card-hover border rounded-3xl p-6 cursor-pointer transition-all duration-300 ${i === activeT ? "border-violet-300 shadow-lg bg-violet-50/50" : "border-gray-100 bg-white"}`}
                onClick={() => setActiveT(i)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-11 h-11 bg-gradient-to-br ${t.color} rounded-xl flex items-center justify-center text-white font-bold text-sm`}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 gradient-bg" ref={ctaRef.ref}>
        <div
          className={`max-w-3xl mx-auto px-6 text-center transition-all duration-700 ${ctaRef.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="text-6xl mb-6 animate-float">🧠</div>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
            Your second brain is{" "}
            <span className="shimmer-text">waiting for you</span>
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto">
            Join students and developers who stopped forgetting and started
            thinking clearer.
          </p>
          <Link
            href="/dashboard"
            className="btn-primary inline-block text-white font-bold px-10 py-5 rounded-2xl text-lg"
          >
            Launch Engram — it's free →
          </Link>
          <p className="text-sm text-gray-400 mt-4">
            No signup needed to try · Your data stays yours
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-950 text-gray-400 py-14">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🧠</span>
                <span className="font-bold text-xl text-white">Engram</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                An AI memory OS built for students, developers, and curious
                minds who want to think better.
              </p>
              <div className="flex gap-3 mt-5">
                {["𝕏", "⬡", "◉"].map((icon, i) => (
                  <button
                    key={i}
                    className="w-9 h-9 bg-gray-800 rounded-xl flex items-center justify-center text-gray-300 hover:text-white hover:bg-violet-600 hover:scale-110 transition-all text-sm"
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-white font-semibold mb-4 text-sm">Product</p>
              {["Features", "How it works", "Dashboard", "Roadmap"].map((l) => (
                <a
                  key={l}
                  href="#"
                  className="block text-sm py-1.5 hover:text-violet-400 transition-colors"
                >
                  {l}
                </a>
              ))}
            </div>
            <div>
              <p className="text-white font-semibold mb-4 text-sm">Legal</p>
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (l) => (
                  <a
                    key={l}
                    href="#"
                    className="block text-sm py-1.5 hover:text-violet-400 transition-colors"
                  >
                    {l}
                  </a>
                ),
              )}
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-xs">
              © 2026 Engram. Built with ❤️ for second brains.
            </p>
            <p className="text-xs">Made by a student, for students 🚀</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
