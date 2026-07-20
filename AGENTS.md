# AGENTS.md — Freelance CRM MVP

## What this is

Vanilla JS single-page app. No framework, no build step, no package manager, no bundler. All code is plain ES modules loaded via `<script>` tags.

## Local dev

```bash
npx serve .        # → http://localhost:3000
python -m http.server 8080   # alternative
```

No `npm install` needed. No `package.json` exists.

## Script load order (critical)

In `index.html`, scripts load in this exact order — globals from earlier files are used by later ones:

1. `config.js` — `getConfig()`, `saveConfig()`, `toggleConfig()`
2. `supabase.js` — `initSupabase()`, auth wrappers, DB CRUD, OpenAI proxy
3. `app.js` — all UI logic, state, event handlers

Never break this order. All functions are global (no modules).

## Architecture: dual-mode backend

- **Supabase configured** → auth + Postgres + RLS via Supabase JS v2 (CDN)
- **No config** → everything falls back to `localStorage` automatically

The toggle is `useSupabase` (global bool in `supabase.js`). Every DB function checks this flag.

API keys are stored in `localStorage` under key `freelanceai_config` (NOT `crm_config` — README is wrong about this).

## UI language

All user-facing text is **Spanish**. Keep it consistent when adding features.

## Database

Schema: `schema.sql` — 6 tables: `contacts`, `deals`, `proposals`, `emails`, `invoices`, `activity`.

All tables have RLS with `auth.uid() = user_id`. Every table has a `user_id UUID REFERENCES auth.users(id)` column.

Run `schema.sql` in Supabase SQL Editor to set up. The `ALTER DATABASE` line at the top is a placeholder — Supabase manages JWT secrets automatically.

**Note:** README lists tables (`profiles`, `email_events`, `invoice_items`, `activity_log`) that do NOT exist in `schema.sql`. The schema is the source of truth.

## Known technical debt

- `app.js` is 921 lines (monolith) — needs splitting
- `styles.css` is 759 lines — needs splitting
- No tests, no linting, no formatter, no CI
- OpenAI API key is called directly from the browser (security risk in production)
- Inline event handlers (`onclick`, `onsubmit`) throughout `index.html`
- No TypeScript, no module system — everything is global

## Security notes

- OpenAI API key is sent from the browser to `api.openai.com` — acceptable for MVP, not for production
- Supabase anon key is client-side (standard for Supabase, RLS protects data)
- Never move secrets to `localStorage` if they weren't already there
- RLS policies are the only data isolation — never disable them

## Roadmap context

Tests (Playwright + Vitest) and TypeScript + Vite migration are planned but not started. When adding tests, the project will need a `package.json` first.
