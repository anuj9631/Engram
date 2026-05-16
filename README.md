<div align="center">

<img src="https://img.shields.io/badge/version-1.0.0-7c3aed?style=for-the-badge&labelColor=0f172a" />
<img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&labelColor=0f172a" />
<img src="https://img.shields.io/badge/Supabase-pgvector-3ecf8e?style=for-the-badge&logo=supabase&labelColor=0f172a" />
<img src="https://img.shields.io/badge/license-MIT-4f46e5?style=for-the-badge&labelColor=0f172a" />

<br /><br />

```
███████╗███╗   ██╗ ██████╗ ██████╗  █████╗ ███╗   ███╗
██╔════╝████╗  ██║██╔════╝ ██╔══██╗██╔══██╗████╗ ████║
█████╗  ██╔██╗ ██║██║  ███╗██████╔╝███████║██╔████╔██║
██╔══╝  ██║╚██╗██║██║   ██║██╔══██╗██╔══██║██║╚██╔╝██║
███████╗██║ ╚████║╚██████╔╝██║  ██║██║  ██║██║ ╚═╝ ██║
╚══════╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝
```

### **Your second brain, finally built.**

*An AI-powered personal memory OS that captures everything you know,*  
*think, and learn — then lets you ask questions and get answers from your own mind.*

<br />

[🚀 Live Demo]https://engram-byanuj.vercel.app/ · [📖 Docs](#-how-it-works) · [🐛 Report Bug](https://github.com/yourusername/engram/issues) · [✨ Request Feature](https://github.com/yourusername/engram/issues)

<br />

</div>

---

## 🧠 What is Engram?

Most people forget **70% of what they learn within 24 hours.** Notes get buried. Ideas get lost. Your brain is not a hard drive.

**Engram fixes that.**

Dump your thoughts, notes, research, and ideas into Engram. Ask it anything in plain English. It searches your memories semantically — understanding *what you mean*, not just what you typed — and gives you precise, cited answers drawn entirely from *your own knowledge*.

> Like having a genius assistant that only knows *you*.

<br />

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 **Universal Memory** | Capture notes, ideas, docs, conversations. Everything stored as structured, searchable memory |
| ✨ **Context-Aware AI** | Ask in plain English. Engram searches semantically and gives cited answers from your own data |
| 🎯 **Predictive Thinking** | Preparing for an interview? Engram surfaces your relevant experience automatically |
| 📈 **Personal Growth** | Tracks goals, habits and strengths over time. Gets smarter the more you use it |
| 🔒 **Fully Private** | Your memories belong only to you. End-to-end encryption, zero data sharing |
| ⚡ **Instant Search** | Vector-powered semantic search. Under a second, every time |
| 🌙 **Dark Mode** | Full dark/light theme support, system-aware |
| 📤 **Data Export** | Export all your memories as JSON or Markdown anytime |

<br />

## 🛠️ Tech Stack

```
Frontend          Backend / DB         AI / Search
──────────        ────────────         ───────────
Next.js 15        Supabase             OpenAI Embeddings
TypeScript        PostgreSQL           pgvector (cosine similarity)
Tailwind CSS      Row Level Security   Semantic RAG pipeline
next-themes       Realtime Auth        Claude API (AI chatbot)
```

<br />


## 🚀 How It Works

```
  ┌─────────────────────────────────────────────────────────┐
  │                                                         │
  │   01. ADD              02. UNDERSTAND       03. ASK     │
  │                                                         │
  │  Type a note  ──►  Converted to a      ──►  Ask in     │
  │  paste idea        semantic vector          plain       │
  │  upload doc        capturing meaning        English     │
  │                    not just keywords                    │
  │                                                         │
  │                         pgvector                        │
  │                    cosine similarity                     │
  │                    top-k retrieval                      │
  │                         │                              │
  │                         ▼                              │
  │                    LLM generates                        │
  │                    cited answer                         │
  │                    from YOUR data                       │
  │                                                         │
  └─────────────────────────────────────────────────────────┘
```

<br />

## ⚡ Quick Start

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- An [OpenAI](https://openai.com) API key
- An [Anthropic](https://anthropic.com) API key (for AI chatbot)

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/engram.git
cd engram
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

```env
# .env.local

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
```



### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

<br />

## 📁 Project Structure

```
engram/
├── app/
│   ├── page.tsx              # Landing page
│   ├── dashboard/
│   │   └── page.tsx          # Main dashboard
│   └── api/
│       ├── embed/            # OpenAI embedding endpoint
│       └── ask/              # RAG query endpoint
│
├── components/
│   ├── Navbar.tsx            # Navigation with auth
│   ├── Logo.tsx              # Engram logo component
│   ├── ThemeToggle.tsx       # Dark/light toggle
│   ├── AiChatBot.tsx         # Floating AI assistant
│   ├── ProfilePage.tsx       # Profile + export
│   └── SignInModal.tsx       # Auth modal
│
├── lib/
│   └── supabase.ts           # Supabase client + types
│
└── public/
    └── screenshots/
```

<br />

## 🗺️ Roadmap

- [x] Core memory storage with semantic search
- [x] AI chatbot powered by Claude
- [x] User profiles with domain tracking
- [x] Dark mode
- [x] JSON + Markdown export
- [ ] 📎 File & PDF upload support
- [ ] 🔗 Browser extension for web clipping
- [ ] 📱 Mobile app (React Native)
- [ ] 🔁 Spaced repetition review mode
- [ ] 🤝 Shared memory spaces (teams)
- [ ] 📊 Memory analytics dashboard
- [ ] 🔌 Obsidian / Notion import

<br />

## 📊 Performance

```
Search latency      < 300ms   (pgvector cosine similarity)
Embedding gen       < 500ms   (OpenAI text-embedding-3-small)
Auth                Instant   (Supabase JWT)
Cold start          < 1s      (Next.js edge runtime)
```

<br />

## 🤝 Contributing

Contributions are what make open source amazing. Any contribution you make is **greatly appreciated**.

```bash
# 1. Fork the repo
# 2. Create your feature branch
git checkout -b feature/AmazingFeature

# 3. Commit your changes
git commit -m 'Add AmazingFeature'

# 4. Push to the branch
git push origin feature/AmazingFeature

# 5. Open a Pull Request
```

Please make sure to update tests and follow the existing code style.

<br />

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<br />

## 👨‍💻 Author

Built with ❤️ by a student, for students.

> *"Stop forgetting. Start thinking clearer."*

<div align="center">

<br />

**[⬆ Back to top](#)**

<br />

[![Made with Next.js](https://img.shields.io/badge/Made%20with-Next.js-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Powered by Supabase](https://img.shields.io/badge/Powered%20by-Supabase-3ecf8e?style=flat-square&logo=supabase)](https://supabase.com)
[![AI by Anthropic](https://img.shields.io/badge/AI%20by-Anthropic-CC785C?style=flat-square)](https://anthropic.com)

</div>
