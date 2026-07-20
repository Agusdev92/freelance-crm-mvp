# Changelog

El formato de este archivo se basa en [Keep a Changelog](https://keepachangelog.com/es/1.1.0/).

## [Unreleased]

## [0.2.0] - 2026-07-20

### Added
- **Toast notifications:** Context-based system with success/error/info variants, auto-dismiss after 4s, slide-in animation.
- **Loading states:** `Spinner`, `LoadingPage`, `LoadingSection` components replacing inline "Cargando..." text.
- **Confirm dialogs:** `ConfirmContext` with `useConfirm()` hook returning `Promise<boolean>`. Replaces native `confirm()` in all delete actions (Contacts, Pipeline, Proposals, Emails, Invoices).
- **Error boundary:** Class component wrapping the entire app. Shows fallback UI with error message and reload button.
- **Lazy-loaded routes:** All 6 pages loaded via `React.lazy()` + `Suspense`. Each page is a separate Vite chunk (~3-7KB).
- **Responsive sidebar:** Hamburger menu on mobile, slide-in drawer with backdrop overlay, always visible on desktop (lg+).
- **Responsive tables:** Contacts, Emails, Invoices pages show card layouts on mobile instead of tables. Dashboard and Pipeline grids adapt to screen size.
- **Tests:** 42 unit + component tests using Vitest + React Testing Library + jsdom. Covers utils, contacts/activity services, Button, Badge, Modal, Toast, ErrorBoundary.
- **Test infrastructure:** Vitest config, jsdom environment, jest-dom matchers, `npm test` and `npm run test:watch` scripts.

### Changed
- All hooks (useContacts, useDeals, useProposals, useEmails, useInvoices) now show toast on success/error instead of silent failures.
- All modals and forms use responsive grid layouts (stack on mobile, side-by-side on desktop).
- Updated docs: ARCHITECTURE.md, ROADMAP.md, DECISIONS.md for React version.

### Removed
- Native `confirm()` calls (replaced with ConfirmDialog modal).
- Inline "Cargando..." text (replaced with Spinner components).

## [0.1.0] - 2026-07-20

### Added
- **Auth:** Login y registro con email/password. Modo Supabase (Postgres + RLS) y fallback localStorage.
- **Config panel:** Formulario para ingresar Supabase URL/Key y OpenAI API Key.
- **Contactos:** CRUD completo con búsqueda por nombre, email, empresa y tags.
- **Pipeline Kanban:** 4 columnas (Lead, Propuesta, Negociación, Cerrado). Drag-and-drop nativo.
- **Propuestas IA:** Generador con OpenAI (gpt-4o-mini). Fallback offline con plantilla.
- **Email Tracking:** Registro manual de emails enviados. Simulación de apertura.
- **Facturación:** CRUD de facturas con numeración automática, estados, y estadísticas.
- **Dashboard:** 4 tarjetas KPI, deals recientes, feed de actividad.
- **Actividad:** Log de últimas 20 acciones del usuario.
- **Schema SQL:** 6 tablas con RLS e índices.
- **UI:** Tema oscuro, responsive, sistema de modales, sidebar de navegación.

[Unreleased]: https://github.com/Agusdev92/freelance-crm-mvp/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/Agusdev92/freelance-crm-mvp/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/Agusdev92/freelance-crm-mvp/releases/tag/v0.1.0
