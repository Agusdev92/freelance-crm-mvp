# AGENTS.md — Freelance CRM MVP

## What this is

React 19 + TypeScript + Vite + TailwindCSS v4 single-page application. Dual-mode backend (Supabase or localStorage fallback).

## Local dev

```bash
npm install
npm run dev        # → http://localhost:5173
```

## Scripts

```bash
npm run dev        # Vite dev server
npm run build      # tsc -b && vite build
npm run preview    # Preview production build
npm run lint       # ESLint
npm run format     # Prettier
npm test           # Vitest (single run)
npm run test:watch # Vitest (watch mode)
```

## Architecture

### File Structure

```
src/
├── lib/           # Types, utils, supabase client
├── services/      # One file per domain (SRP), dual-mode (Supabase + localStorage)
├── hooks/         # One hook per module (useAuth, useContacts, etc.)
├── contexts/      # ToastContext, ConfirmContext
├── components/
│   ├── ui/        # Design system (Button, Modal, Input, Spinner, Toast, etc.)
│   ├── layout/    # Sidebar, AppLayout
│   ├── auth/      # LoginPage
│   └── ErrorBoundary.tsx
├── pages/         # One page per view (lazy-loaded)
└── test/          # Vitest setup
```

### Provider Hierarchy

```
StrictMode > ErrorBoundary > AuthProvider > ToastProvider > ConfirmProvider > BrowserRouter
```

### Dual-Mode Backend

- **Supabase configured** → auth + Postgres + RLS via Supabase JS v2
- **No config** → everything falls back to `localStorage`

The toggle is `isSupabaseConfigured` (from `lib/supabase.ts`).

### Code Splitting

All pages are lazy-loaded via `React.lazy()` in `App.tsx`. Each page is a separate Vite chunk.

## UI language

All user-facing text is **Spanish**. Keep it consistent when adding features.

## Database

Schema: `supabase/schema.sql` — 6 tables: `contacts`, `deals`, `proposals`, `emails`, `invoices`, `activity`.

All tables have RLS with `auth.uid() = user_id`.

## Testing

```bash
npm test           # Single run
npm run test:watch # Watch mode
```

- Unit tests: `src/lib/__tests__/`, `src/services/__tests__/`
- Component tests: `src/components/__tests__/`
- Framework: Vitest + React Testing Library + jsdom

## Security notes

- OpenAI API key is sent from the browser to `api.openai.com` — acceptable for MVP, not for production
- Supabase anon key is client-side (standard for Supabase, RLS protects data)
- RLS policies are the only data isolation — never disable them

## Roadmap

See `docs/ROADMAP.md` for full roadmap.
