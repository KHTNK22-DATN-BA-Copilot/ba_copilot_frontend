# Kiến trúc Frontend — BA Copilot

Tài liệu này mô tả kiến trúc phía frontend cho dự án BA Copilot, dựa trên cấu trúc thư mục hiện có trong repository. Mục tiêu là cung cấp mô hình thành phần, luồng dữ liệu, và khuyến nghị về quản lý trạng thái, routing, testing và triển khai.

## Tổng quan thư mục chính

-   [app/layout.tsx](app/layout.tsx) — root layout của ứng dụng (theme, global styles).

-   [app/page.tsx](app/page.tsx) — trang chủ.

-   [app/(auth)/layout.tsx](<app/(auth)/layout.tsx>) — layout cho nhóm route xác thực.

-   [app/dashboard/layout.tsx](app/dashboard/layout.tsx) — layout cho dashboard (`DashboardLayout`).

-   [app/(generator)/wireframegenerator/page.tsx](<app/(generator)/wireframegenerator/page.tsx>) — một trang generator mẫu (`WireframeGeneratorPage`).

-   [components/layout/Sidebar.tsx](components/layout/Sidebar.tsx), [components/layout/Header.tsx](components/layout/Header.tsx), [components/layout/Footer.tsx](components/layout/Footer.tsx) — các component layout tái sử dụng.

-   [components/ui/button.tsx](components/ui/button.tsx) và các UI primitives trong [components/ui/](components/ui) — hệ thống thành phần UI (Shadcn/Radix).

-   [lib/user.ts](lib/user.ts), [lib/utils.ts](lib/utils.ts) — helper và abstraction gọi API / xử lý dữ liệu.

-   `public/` — assets tĩnh (logo, ảnh).

-   `docs/` — tài liệu và luồng nghiệp vụ (ví dụ [docs/flow/srs_generator_flow.md](docs/flow/srs_generator_flow.md), [docs/project-plan/fe-project-plan.md](docs/project-plan/fe-project-plan.md)).

-   `docker-compose.yml` & `Dockerfile` — phát triển/containerization.

## Mô hình kiến trúc (layers)

1. Presentation (Pages & Layouts)
    - Các route logic nằm trong `app/` (Next.js App Router). Ví dụ: [`DashboardLayout`](app/dashboard/layout.tsx), [`WireframeGeneratorPage`](<app/(generator)/wireframegenerator/page.tsx>).

2. UI Components
    - Thư viện UI (components/ui/_) và các component bố cục (components/layout/_).

3. State & Data layer
    - Store/clients (ví dụ Zustand / React Context / TanStack Query). Helpers tại [lib/](lib).

4. API layer
    - Calls tới backend qua các API route / SDK, triển khai ở [lib/utils.ts](lib/utils.ts) và API client dùng trong server actions hoặc client fetch.

5. Assets & Config
    - `public/`, `.env`/`.env.sample`, `next.config.ts`, `docker-compose.yml`.

## Luồng dữ liệu chính (sequence)

```mermaid
flowchart TD
  subgraph FE
    U[User Interaction]
    P[Page / Route]
    C[UI Components]
    S[State Store / Cache]
    L[Lib (api helpers)]
  end
  subgraph BE
    API[Backend REST / GraphQL]
  end

  U --> P
  P --> C
  C -->|read/write| S
  P -->|server action / fetch| L
  L --> API
  API --> L
  L --> S
  S --> C
```

## Luồng điều hướng và cấu trúc

```
graph TD
  Home["/ (app/page.tsx)"]
  Auth["/(auth) (app/(auth)/layout.tsx)"]
  Login["/login"]
  Register["/register"]
  Dashboard["/dashboard (app/dashboard/page.tsx)"]
  Generator["/wireframegenerator (app/(generator)/wireframegenerator/page.tsx)"]

  Home --> Auth
  Auth --> Login
  Auth --> Register
  Home --> Dashboard
  Dashboard --> Generator
```

## Quản lý trạng thái và dữ liệu
  - Dùng TanStack Query / React Query cho dữ liệu fetch từ server (caching, revalidation). Tích hợp ở layer lib (ví dụ implement API calls trong lib/user.ts).

  - Dùng Context hoặc Zustand cho UI state (menu mở/đóng, theme) — ví dụ isDarkMode/isMenuOpen được quản lý trong app/dashboard/layout.tsx.

  - Sử dụng builder/DTO trong lib khi cần (để tạo model user giống pattern trong repo).

## Authentication & Protected routes
  - Route nhóm (auth) chứa các trang xác thực; các trang dashboard cần kiểm tra session/token trước khi render. Implement redirect/guard tại server-side hoặc client-side tùy case. Tham khảo docs/project-plan/fe-project-plan.md cho yêu cầu Auth.

## Component & UI system
  - Tập trung các primitives trong components/ui/. Các pages chỉ compose các primitives này và tránh logic fetch nặng trong UI component.

  - Layouts: header/sidebar/footer ở [components/layout/*] nhằm đảm bảo consistency.

## Testing
  - Test UI components với Testing Library nếu cần. Văn bản test cases tham khảo docs/test/dashboard/dashboard.md.

## Deployment / Dev workflow 
  - Local dev: docker-compose.yml phục vụ container dev; npm run dev (mapped port 3000).
  
  - Build & production: Next.js build pipeline; kiểm tra env vars (.env) trước deploy. Tham khảo README.md và next.config.ts.