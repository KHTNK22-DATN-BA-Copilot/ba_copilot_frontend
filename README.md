# BA Copilot Frontend

> AI-powered Business Analysis assistant built with Next.js 15, React 19, and TypeScript.

This frontend helps Business Analysts generate and manage project artifacts (planning, analysis, design docs, SRS, diagrams, wireframes), then iterate with AI-assisted refinement flows. It integrates with FastAPI backend services via server-side API routes, server actions, and WebSocket streaming.

---

## ✨ Key Features

### 🔐 Authentication & User Management
- Email/password sign in with Zod validation
- Google OAuth entry points (login/register)
- Forgot password multi-step flow (Email → OTP → Reset → Success) with InputOTP
- Email verification flow with OTP UI and redirect to login on success
- JWT auth via httpOnly cookies (`access_token`, `refresh_token`)
- Middleware token refresh for protected `/dashboard/*` routes
- Account settings: profile update, visibility section, account deletion, logout

### 📋 Dashboard & Navigation
- Dashboard overview with project cards and quick actions
- Project lifecycle: create, edit, soft-delete
- Global search (Ctrl+K / Cmd+K) for pages/projects/documents/users
- Dark/light mode with localStorage persistence
- Responsive layout: desktop sidebar + mobile overlay navigation

### 🔄 Workflow & Phase Generation

The app exposes a guided workflow driven by three main phases. It allows real-time, WebSocket-streamed document generation. 

1. **Planning Phase**: Stakeholder Register, High-level Requirements, Requirements Management Plan, Business Case, Scope Statement, Product Roadmap.
2. **Analysis Phase**: Feasibility Study, Cost-Benefit Analysis, Risk Register, Compliance.
3. **Design Phase**: SRS, HLD (Architecture/Cloud/Tech Stack), LLD (Architecture/DB/API/Pseudocode), UI/UX (Wireframe/Mockup/Prototype), RTM.

Capabilities:
- WebSocket streaming generation via `NEXT_PUBLIC_WS_DOMAIN` (default local: `ws://localhost:8010`)
- Dependency-aware document constraints (`required` and `recommended`)
- Cascading dependent uncheck and cross-phase prerequisite validation
- Prompt + reference file input for generation and regeneration
- Markdown preview with Mermaid support

### 📁 File Management
- Tree UI with Composite-style folder/file components
- Operations: upload, create folder, rename folder, delete file/folder, download/export
- Optimistic updates for upload with rollback on failure
- Supported upload types: PDF, DOC, DOCX, TXT, MD (max 10MB)

### 🤖 Reusable AI Chat System
- `ChatWithAI` configurable for FormData/JSON APIs
- Prebuilt configs for SRS, diagram, and wireframe regeneration (`chat-configs.ts`)
- Supports custom payload builders and response extractors

---

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 15.5 (App Router), React 19.1, TypeScript 5 |
| Styling | Tailwind CSS v4, `tw-animate-css`, dark/light mode |
| UI | Radix UI + shadcn/ui, Lucide, Heroicons, FontAwesome, React Icons |
| Additional UI libs | MUI (`@mui/material`) + Emotion |
| State/Data | React Context, SWR, server actions, custom hooks |
| Validation | Zod v4 |
| Markdown | `react-markdown`, `remark-gfm`, `remark-breaks`, `github-markdown-css` |
| Diagrams | Mermaid.js 11.12 |
| Notifications | Sonner |
| Observability | Sentry (`@sentry/nextjs`) |
| HTTP/Utils | Fetch API, Axios, Diff |
| Fonts | Geist Sans + Geist Mono |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (or Docker)
- Backend services available (default local backend: `http://localhost:8010`)

### Option 1: npm

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### Option 2: Docker

```bash
docker compose up --build -d
```

### ⚠️ Environment Setup

Create or update `.env` in this folder:

| Variable | Example (local) | Purpose |
|----------|------------------|---------|
| `BACKEND_DOMAIN` | `http://localhost:8010` | Server-side API proxy and middleware refresh |
| `NEXT_PUBLIC_BACKEND_DOMAIN` | `http://localhost:8010` | Client-side authenticated API calls (where needed) |
| `NEXT_PUBLIC_WS_DOMAIN` | `ws://localhost:8010` | Workflow WebSocket generation stream |

Optional:

| Variable | Purpose |
|----------|---------|
| `AI_DOMAIN` / `NEXT_PUBLIC_AI_DOMAIN` | AI service endpoint references |

---

## 📁 Project Structure

```text
ba-copilot/
├── app/
│   ├── (auth)/                    # Login/register/forgot-password/verify flows
│   ├── auth/google/callback/      # Google OAuth callback page
│   ├── api/                       # Next.js route handlers (BFF/proxy)
│   │   ├── auth/token/
│   │   ├── login/ logout/ register/ me/
│   │   ├── projects/[id]/
│   │   ├── forgot-password/*
│   │   ├── diagram/
│   │   ├── srs-generate/ (+ download/doc)
│   │   └── wireframe-generate/ (+ template)
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   ├── accountsetting/
│   │   └── project/[id]/
│   │       ├── workflows/         # Guided 5-step workflow
│   │       ├── phases/            # Planning / Analysis / Design boards
│   │       ├── diagrams/
│   │       ├── srsgenerator/
│   │       ├── wireframegenerator/
│   │       ├── aiconversations/
│   │       └── files/
│   ├── new-project/
│   └── layout.tsx
├── actions/                       # Server actions
├── services/                      # Service layer for backend communication
├── components/
│   ├── chat-bot/
│   ├── file-management/
│   ├── file/
│   ├── layout/
│   └── ui/
├── context/
├── hooks/
├── docs/
├── middleware.ts
└── docker-compose.yml
```

---

## 🏗 Architecture Notes

### Server-first Rendering
`page.tsx` and `layout.tsx` are server components by default. Interactive sections are moved into client components (`"use client"`).

### BFF + Server Action Pattern
The frontend combines:
- Route handlers in `app/api/*` as a backend-for-frontend layer
- Server actions in `actions/*` for typed backend operations

This keeps cookies/token handling on the server and limits direct backend exposure to the browser.

### Workflow Dependency System
Workflow and phase generation use a centralized dependency map (required/recommended) to:
- prevent invalid selections
- show missing prerequisites
- support dependent cascade behavior
- enforce cross-phase generation order

### Real-time Generation
Phase/wizard generation streams status updates through WebSocket (`planning`, `analysis`, `design`) and updates per-document progress in UI.

---

## 🌐 Deployment

- Docker-ready (`Dockerfile`, `docker-compose.yml`)
- CI/CD workflow available in `.github/workflows/fe-ci.yml` (build and image publish/deploy)
- Vercel-compatible Next.js application

---

## 📄 Development Guidelines

1. Keep server-first boundaries clear: only use client components where interaction is required.
2. Place reusable primitives in `components/ui`, feature components outside `components/ui`.
3. Prefer server actions and API proxies for authenticated backend operations.
4. Keep workflow document dependencies in sync with backend constraints.
5. Ensure all UI changes support dark mode and responsive layouts.




