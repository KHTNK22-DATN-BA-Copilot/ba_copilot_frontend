# BA Copilot Frontend

> AI-powered Business Analysis assistant — built with Next.js 15, React 19, and TypeScript.

BA Copilot helps Business Analysts automate documentation, generate diagrams, create wireframes, and manage project workflows with the power of AI. The frontend communicates with a FastAPI backend via server-side API route proxies and WebSocket connections.

---

## ✨ Key Features

### 🔐 Authentication & User Management
- **Email/Password login** with Zod schema validation
- **Forgot Password** — multi-step flow (Email → OTP → Reset → Success) with `InputOTP` component
- **Email Verification** — token-based verification with auto-redirect
- **JWT Authentication** — httpOnly cookies (`access_token` 30 min, `refresh_token` 7 days)
- **Middleware** — automatic token refresh for protected `/dashboard/*` routes
- **Account Settings** — profile editing, visibility settings, account deletion
- **Logout** — clears cookies, localStorage, sessionStorage

### 📋 Dashboard
- **Project Overview** — stat cards (total projects from API), quick actions
- **Project Management** — create, edit, soft-delete projects with loading skeletons
- **Search** — full-screen modal (Ctrl+K / Cmd+K) across pages, projects, documents
- **Dark/Light Mode** — persistent toggle saved to localStorage
- **Responsive Layout** — collapsible sidebar on desktop, overlay on mobile

### 🔄 Project Workflows (5-Step Wizard)
A guided workflow for generating BA documents across 3 phases:

| Step | Documents |
|------|-----------|
| **Planning** | Project Charter (Stakeholder Register, High-level Requirements, Requirements Management Plan), Business Case, Scope Statement, Product Roadmap |
| **Analysis** | Feasibility Study, Cost-Benefit Analysis, Risk Register, Compliance |
| **Design** | SRS, HLD (Architecture, Cloud, Tech Stack), LLD (Architecture, DB, API, Pseudocode), UI/UX (Wireframes, Mockups, Prototypes), RTM |

- **WebSocket-based generation** — real-time progress streaming via `ws://localhost:8010`
- **Document constraints** — dependency-aware selection; prerequisite documents must exist before dependents can be generated (cascade uncheck, topological select-all)
- **Cross-step dependencies** — Design documents can require Planning/Analysis docs as prerequisites
- **Prompt input** with file attachment support
- **Markdown + Mermaid preview** with `github-markdown-css` styling

### 📊 Diagram Generator
- **Diagram types**: Use Case, Class, Activity
- **Create**: title/description + file upload → AI generation
- **View**: Mermaid.js rendering with Markdown support
- **AI Regeneration**: iterative editing via `ChatWithAI` component
- **History**: list all project diagrams

### 📝 SRS Generator
- **Multi-tab interface**: Create New, Template, Recent Documents
- **Create**: project overview + requirements + diagram options + constraints + file upload
- **View**: rich Markdown rendering (`react-markdown` + `remark-gfm` + `remark-breaks`)
- **Download**: export as `.md` file
- **AI Regeneration**: iterative document refinement via chat
- **Context management**: `SrsDataStoreProvider` for form state

### 🎨 Wireframe Generator
- **Create**: file upload → AI-generated HTML/CSS wireframes
- **Live Preview**: iframe `srcDoc` rendering with split view toggle (code + preview)
- **Code View**: tabbed HTML/CSS editor
- **AI Regeneration**: iterative wireframe refinement via chat
- **History**: list all project wireframes

### 💬 AI Conversations
- Chat interface with conversation management sidebar
- Suggestion prompts for empty states
- New conversation creation

### 📁 File Management
- **Tree-based UI** — Composite pattern (`FolderComposite`, `FileLeaf`)
- **Repository pattern** — `IFileRepository` interface with `ApiRepository` implementation
- **Operations**: upload files, create/rename/delete folders, drag-and-drop support
- **Supported formats**: PDF, DOC, DOCX, TXT, MD (max 10MB)
- **Optimistic UI** — instant updates with rollback on error

### 🤖 Reusable Chat System
- `ChatWithAI` — configurable chat component with pre-built configs for SRS, Diagram, Wireframe regeneration
- Supports FormData and JSON payloads, custom response extractors, Markdown rendering
- Used across all viewer components for AI-powered iterative editing

---

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 15.5 (App Router), React 19.1, TypeScript 5 |
| **Styling** | Tailwind CSS v4, `tw-animate-css`, dark/light mode |
| **UI Components** | Radix UI (Dialog, Tabs, Select, Checkbox, Tooltip, Progress, etc.), shadcn/ui |
| **State** | React Context (`FileContext`, `SRSGeneratorContext`), SWR, custom hooks |
| **Validation** | Zod v4 |
| **Markdown** | `react-markdown` + `remark-gfm` + `remark-breaks` + `github-markdown-css` |
| **Diagrams** | Mermaid.js 11.12 |
| **Icons** | Lucide React, Heroicons, FontAwesome, React Icons |
| **Notifications** | Sonner (toast) |
| **Fonts** | Geist Sans + Geist Mono |
| **Backend** | FastAPI (Python) at `localhost:8010` |
| **Real-time** | WebSocket for workflow document generation |
| **Deployment** | Docker, Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (or Docker)
- Backend running at `http://localhost:8010`

### Option 1: npm

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Option 2: Docker

```bash
cd ba-copilot
docker compose up --build -d
```

### ⚠️ Environment Setup

Create a `.env` file with the backend domain:

| Runtime | `BACKEND_URL` |
|---------|---------------|
| npm (local) | `http://localhost:8010` |
| Docker | `http://host.docker.internal:8010` |

---

## 📁 Project Structure

```
ba-copilot/
├── app/
│   ├── (auth)/                  # Auth pages (login, register, forgot-password, verify)
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   ├── verify-email/
│   │   └── verify-success/
│   ├── api/                     # Next.js API routes (server-side proxy to backend)
│   │   ├── login/
│   │   ├── logout/
│   │   ├── me/
│   │   ├── projects/
│   │   ├── diagram/
│   │   ├── srs-generate/
│   │   ├── wireframe-generate/
│   │   ├── workflow/
│   │   └── forgot-password/
│   ├── dashboard/
│   │   ├── page.tsx             # Dashboard overview
│   │   ├── layout.tsx           # Dashboard layout (Header, Sidebar, Footer)
│   │   ├── accountsetting/      # Profile & account management
│   │   └── project/[id]/        # Project detail
│   │       ├── workflows/       # 5-step workflow wizard
│   │       ├── diagrams/        # Diagram generator
│   │       ├── srsgenerator/    # SRS generator
│   │       ├── wireframegenerator/  # Wireframe generator
│   │       ├── aiconversations/ # AI chat
│   │       └── files/           # File management
│   ├── new-project/             # New project form
│   ├── globals.css              # Global styles + Tailwind theme
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page
├── components/
│   ├── ui/                      # Shadcn UI components (button, dialog, checkbox, tooltip, etc.)
│   ├── layout/                  # Header, Sidebar, Footer
│   ├── chat-bot/                # ChatWithAI, ChatBot, chat-configs
│   ├── file/                    # File upload components
│   ├── file-management/         # Tree-based file/folder manager
│   └── icons/                   # Custom icon components
├── context/                     # React Context providers
│   ├── FileContext.tsx           # File upload state
│   └── SRSGeneratorContext.tsx   # SRS form state
├── lib/                         # Utilities, API helpers, types
├── public/                      # Static assets (logos, icons)
├── docs/                        # Project documentation
├── middleware.ts                # Auth middleware (token refresh, route protection)
├── package.json
├── tsconfig.json
└── docker-compose.yml
```

---

## 🏗 Architecture

### Server Components (Default)
All `page.tsx` and `layout.tsx` files are **server components** by default. Client interactivity is isolated into dedicated `_components/` folders with `'use client'` directives.

### API Route Proxy Pattern
All frontend API routes (`app/api/`) act as **server-side proxies** to the Python backend, handling authentication via httpOnly cookies. The frontend never exposes the backend URL to the browser.

### Document Constraint System
The workflow system implements a **dependency-aware document selection** mechanism:
- Each document type declares `required` and `recommended` prerequisites
- Unchecking a document cascades to all transitive dependents (BFS traversal)
- Select-all uses topological ordering to respect dependency order
- Cross-step constraints: Design docs can require Planning/Analysis docs

---

## 📋 Shadcn UI Components

Installed components: `alert-dialog`, `badge`, `button`, `card`, `checkbox`, `dialog`, `input`, `input-otp`, `label`, `progress`, `select`, `tabs`, `textarea`, `tooltip`.

```bash
# Install a new component
npx shadcn@latest add <component-name>
```

Documentation: https://ui.shadcn.com/docs/components

---

## 🌐 Deployment

- **Platform**: Vercel
- **Live URL**: https://ba-copilot-frontend.vercel.app/
- **Docker**: production-ready `Dockerfile` with standalone output

---

## 📄 Development Guidelines

1. **Server-first**: Keep `page.tsx` and `layout.tsx` as server components to reduce bundle size
2. **Component naming**: PascalCase (e.g., `SignInButton`, `DocumentSelector`)
3. **Custom components**: Place outside `components/ui/` (reserved for Shadcn)
4. **API calls**: Always go through Next.js API routes — never call backend directly from client
5. **State management**: Use React Context for cross-component state, SWR for data fetching
6. **Dark mode**: All UI must support both light and dark themes




