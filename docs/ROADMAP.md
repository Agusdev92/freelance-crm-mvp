# Roadmap

Current state vs planned features. Everything in "Current" is verified in the codebase. Everything in "Planned" is from `README.md` roadmap and has **not** been implemented.

---

## Current State

These features exist and work today:

| Feature | Status | Evidence |
|---------|--------|----------|
| Email/password auth | Working | `supabase.js:17-44`, `app.js:20-122` |
| localStorage fallback | Working | `app.js:29-37`, `app.js:64-76`, `app.js:148-155` |
| Config panel (API keys) | Working | `config.js`, `index.html:40-51` |
| Contacts CRUD + search | Working | `app.js:246-373` |
| Pipeline Kanban (4 stages) | Working | `app.js:376-542` |
| Native drag-and-drop | Working | `app.js:408-448` |
| AI proposal generation | Working | `supabase.js:106-149` |
| Offline fallback proposals | Working | `supabase.js:152-265` |
| Email tracking (manual) | Working | `app.js:662-774` |
| Invoice CRUD + status | Working | `app.js:777-906` |
| Activity log | Working | `app.js:170-185` |
| Dashboard stats | Working | `app.js:204-238` |
| Dark theme | Working | `styles.css` |
| Responsive (≤1024px, ≤768px) | Working | `styles.css:723-759` |
| Modal system | Working | `app.js:908-921` |
| Supabase RLS (all 6 tables) | Working | `schema.sql:83-123` |

---

## Planned (from README roadmap)

These are listed in `README.md` lines 173-179. **None have been started.**

### Multi-user / teams
- Invites, roles, team management
- Requires: `profiles` table, role-based RLS, invite flow
- Blocked by: no `profiles` table in current schema

### Payment integration (Stripe / MercadoPago)
- Accept payments on invoices
- Requires: payment provider SDK, webhook handling, server-side code
- Blocked by: no server-side runtime exists

### Email templates + automated sequences
- Pre-built templates, drip campaigns
- Requires: email sending service (SendGrid, Resend, etc.), template engine
- Current state: emails are manually recorded, not actually sent

### Dashboard charts (Chart.js / Recharts)
- Funnel visualization, revenue trends
- README mentions Chart.js but it is not loaded or used anywhere in the codebase

### PWA (Service Worker)
- Offline support, installable app
- Currently works offline via localStorage, but no service worker for asset caching

### Tests (Playwright + Vitest)
- E2E and unit tests
- Requires: `package.json`, test framework config, test files
- No testing infrastructure exists today

### TypeScript + Vite migration
- Type safety, build optimization, module system
- Requires: complete rewrite of import/export patterns, tsconfig, Vite config
- Largest planned change — affects every file

---

## Not Listed But Needed

These are not in the README roadmap but are evident from the codebase:

| Item | Why |
|------|-----|
| Input sanitization (XSS prevention) | All `innerHTML` assignments use raw user data |
| ESLint + Prettier | No code quality tooling exists |
| Server-side API proxy for OpenAI | API key exposed to browser |
| README accuracy fixes | Table count, localStorage key name, model name are all wrong |
| Accessibility (ARIA attributes) | No keyboard/screen reader support |
| Loading states for async operations | Only proposal generation shows feedback |
| Error toast notifications | All errors shown as `alert()` |
