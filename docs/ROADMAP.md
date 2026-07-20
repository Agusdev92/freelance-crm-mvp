# Roadmap

Current state vs planned features. Everything in "Current" is verified in the codebase.

---

## Current State (v2.1.0)

These features exist and work today:

| Feature | Status | Notes |
|---------|--------|-------|
| React 19 + TypeScript + Vite | Working | Full type safety, strict mode |
| Tailwind CSS v4 | Working | Dark theme, responsive breakpoints |
| Dual-mode backend (Supabase + localStorage) | Working | All 6 entities |
| Auth (login, register, logout) | Working | Session persistence |
| Contacts CRUD + search | Working | Table (desktop) + cards (mobile) |
| Pipeline Kanban (4 stages) | Working | Drag-and-drop, responsive columns |
| AI proposal generation | Working | OpenAI gpt-4o-mini + offline fallback |
| Email tracking (manual) | Working | Register, mark opened, search |
| Invoice CRUD + status | Working | Stats, mark paid, responsive cards |
| Dashboard stats + activity | Working | 4 KPI cards, recent deals, activity feed |
| Toast notifications | Working | Success/error/info, auto-dismiss |
| Confirm dialogs | Working | Styled modal replaces native confirm() |
| Error boundary | Working | Catches rendering errors globally |
| Lazy-loaded routes | Working | Code splitting per page |
| Responsive sidebar | Working | Hamburger menu on mobile |
| Responsive tables | Working | Card layout on mobile |
| Unit + component tests | Working | 42 tests (Vitest + RTL) |
| ESLint + Prettier | Working | Flat config, react-hooks rules |

---

## Planned

### Short-term (next sprints)

- [ ] Edge Functions for OpenAI (don't expose key in client)
- [ ] Invoice PDF export
- [ ] Proposal export (PDF/HTML)
- [ ] Contact detail page
- [ ] Deal detail page
- [ ] Invoice editing (currently create-only)
- [ ] Overdue invoice auto-detection
- [ ] Bulk operations (delete, status change)
- [ ] E2E tests with Playwright
- [ ] CI/CD pipeline (GitHub Actions)

### Medium-term

- [ ] Email templates + automated sequences
- [ ] Dashboard charts (Recharts)
- [ ] PWA (service worker, offline assets)
- [ ] Multi-user / teams (invites, roles)
- [ ] Pagination (cursor-based)
- [ ] Input sanitization audit

### Long-term

- [ ] Payment integration (Stripe / MercadoPago)
- [ ] i18n framework (beyond hardcoded Spanish)
- [ ] Dark/light theme toggle
- [ ] Accessibility audit (ARIA, keyboard nav)

---

## Resolved in Sprint 1 & 2

- [x] TypeScript + Vite migration (Sprint 1)
- [x] ESLint + Prettier (Sprint 1)
- [x] Toast notifications (Sprint 2)
- [x] Loading states with Spinner (Sprint 2)
- [x] Confirm dialogs replacing native confirm() (Sprint 2)
- [x] ErrorBoundary (Sprint 2)
- [x] Lazy-loaded routes (Sprint 2)
- [x] Responsive sidebar + tables (Sprint 2)
- [x] Vitest + React Testing Library setup (Sprint 2)
- [x] 42 unit + component tests (Sprint 2)
