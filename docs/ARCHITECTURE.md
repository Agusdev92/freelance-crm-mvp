# Architecture

## Overview

FreelanceAI is a React 19 single-page application built with TypeScript and Vite. The backend is optional — when Supabase is configured, data lives in Postgres with RLS; otherwise, everything falls back to `localStorage`.

## File Structure

```
src/
├── main.tsx              # Entry point, renders App in StrictMode + ErrorBoundary
├── App.tsx               # Router setup, lazy-loaded routes, providers
├── index.css             # Tailwind CSS v4 theme (dark palette, custom colors)
├── lib/
│   ├── types.ts          # TypeScript interfaces (Contact, Deal, Proposal, etc.)
│   ├── utils.ts          # Helpers: formatCurrency, formatDate, cn, getInitials
│   └── supabase.ts       # Supabase client init, isSupabaseConfigured flag
├── services/             # One file per domain (SRP)
│   ├── auth.service.ts
│   ├── contacts.service.ts
│   ├── deals.service.ts
│   ├── proposals.service.ts
│   ├── emails.service.ts
│   ├── invoices.service.ts
│   └── activity.service.ts
├── hooks/                # One hook per module
│   ├── useAuth.tsx       # Auth context + provider + useAuth hook
│   ├── useContacts.ts
│   ├── useDeals.ts
│   ├── useProposals.ts
│   ├── useEmails.ts
│   ├── useInvoices.ts
│   └── useActivity.ts
├── contexts/
│   ├── ToastContext.tsx   # Toast notification system
│   └── ConfirmContext.tsx # Confirm dialog system
├── components/
│   ├── ErrorBoundary.tsx  # Global error boundary (class component)
│   ├── ui/               # Design system
│   │   ├── Button.tsx, Badge.tsx, Card.tsx, Input.tsx, Select.tsx
│   │   ├── Textarea.tsx, Modal.tsx, EmptyState.tsx
│   │   ├── Spinner.tsx, Toast.tsx
│   ├── layout/
│   │   ├── AppLayout.tsx  # Protected layout shell + responsive sidebar toggle
│   │   └── Sidebar.tsx    # Fixed sidebar with mobile drawer
│   └── auth/
│       └── LoginPage.tsx  # Login/register form
├── pages/                # One page per route (lazy-loaded)
│   ├── LoginPage.tsx, DashboardPage.tsx, ContactsPage.tsx
│   ├── PipelinePage.tsx, ProposalsPage.tsx
│   ├── EmailsPage.tsx, InvoicesPage.tsx
└── test/
    └── setup.ts          # Vitest + jest-dom setup
```

## Build & Tooling

| Tool | Purpose |
|------|---------|
| Vite 7 | Dev server, bundler, code splitting |
| TypeScript 5.8 (strict) | Type safety, compile-time checks |
| Tailwind CSS v4 | Utility-first styling via `@tailwindcss/vite` |
| ESLint 10 (flat config) | Linting with react-hooks, react-refresh, prettier |
| Prettier | Code formatting |
| Vitest 4 | Unit and component tests |
| React Testing Library | Component testing utilities |

## Code Splitting

All page components are lazy-loaded via `React.lazy()` in `App.tsx`. Each page becomes a separate Vite chunk (~3-7KB). The core bundle includes React, React Router, and shared components.

## Dual-Mode Backend

The `isSupabaseConfigured` flag (from `lib/supabase.ts`) controls which backend is active:

- **Supabase configured** (URL + anon key in env): Auth via `supabase.auth`, data via `supabase.from(table)`, all queries filtered by `user_id = auth.uid()`.
- **No config**: Auth uses `localStorage`. Data stored per-user under keys like `freelanceai_contacts_{userId}`.

Every service function checks this flag before deciding which path to take.

## Provider Hierarchy

```
StrictMode
  └── ErrorBoundary
    └── AuthProvider (useAuth context)
      └── ToastProvider (ToastContext)
        └── ConfirmProvider (ConfirmContext)
          └── BrowserRouter
            └── Routes
```

## UI Component Library

| Component | Props | Description |
|-----------|-------|-------------|
| `Button` | variant (primary/secondary/danger/ghost), size, disabled | Gradient primary, consistent spacing |
| `Badge` | variant (default/success/warning/danger) | Tag/status indicators |
| `Card` | className | Container with surface background |
| `Input` | label, type, placeholder | Form input with dark theme |
| `Select` | label, options, value | Dropdown with custom chevron |
| `Textarea` | label, rows | Multi-line input |
| `Modal` | open, onClose, title | Overlay modal with Escape-to-close |
| `EmptyState` | icon, message | Placeholder for empty lists |
| `Spinner` | size, className | Animated loading indicator |
| `Toast` | (managed by ToastContext) | Auto-dismissing notifications |

## Responsive Breakpoints

- `< 640px` (default): Single column, hamburger sidebar, card layouts for tables
- `≥ 640px` (sm): Pipeline 2-column
- `≥ 768px` (md): Table views, stat grids 2-column
- `≥ 1024px` (lg): Full sidebar, 4-column grids, table+card layouts

## Testing

```bash
npm test          # Run all tests once
npm run test:watch  # Watch mode
```

- Unit tests: `src/lib/__tests__/`, `src/services/__tests__/`
- Component tests: `src/components/__tests__/`
- 42 tests covering utils, services (localStorage mode), and UI components
