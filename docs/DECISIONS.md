# Technical Decisions

Key architectural choices visible in the codebase, with rationale and implications.

---

## 1. Vanilla JS, no framework

**What:** Plain JavaScript with global functions. No React, Vue, Svelte, or any framework.

**Why (implied):** MVP speed — zero build step, instant deploy as static files, no toolchain to maintain.

**Implications:**
- All state is global variables (`app.js:1-11`)
- DOM manipulation via `innerHTML` and `document.getElementById`
- No component model — each view is a function that re-renders a section
- No type safety, no compile-time checks

---

## 2. No build step or bundler

**What:** Files are served as-is. No webpack, Vite, Rollup, or esbuild.

**Why (implied):** Simplicity. Deploy is literally "upload these files."

**Implications:**
- Script load order in `index.html` is the dependency graph
- All functions must be global (no ES modules)
- No tree-shaking, no minification in the repo itself
- CDN-hosted Supabase client is the only "dependency"

---

## 3. Dual-mode backend (Supabase + localStorage)

**What:** The app works with or without a Supabase project. Toggle is `useSupabase` boolean.

**Why (implied):** Instant demo without account creation. Data persists in browser for quick testing.

**Implications:**
- Every CRUD function has `if (useSupabase) { ... } else { ... }` branches
- localStorage mode has no auth enforcement — any "user" can see any data
- localStorage mode uses `Date.now()` for IDs (not UUIDs like Supabase)
- Data keyed by `userId` in localStorage, but no migration path between modes

---

## 4. OpenAI called directly from browser

**What:** `generateProposalWithAI()` in `supabase.js:106-149` sends the API key in a `fetch()` call directly to `api.openai.com`.

**Why (implied):** No server-side code exists. Keeping it simple for MVP.

**Implications:**
- OpenAI API key is visible in browser network tab
- No rate limiting, no spending controls
- Acceptable for personal MVP use, not for production with real users
- Fallback template generator exists (`generateAIProposalFallback`) for when no key is set

---

## 5. Model mismatch: code says `gpt-3.5-turbo`, README says `gpt-4o-mini`

**What:** `supabase.js:122` uses `model: 'gpt-3.5-turbo'`. README line 57 recommends `gpt-4o-mini`.

**Why:** Likely the code was written first with 3.5-turbo, README updated later without syncing.

**Implication:** The actual model used at runtime is `gpt-3.5-turbo`. README is misleading.

---

## 6. Dark theme only, no light mode

**What:** `styles.css` defines a single dark color palette via CSS custom properties (`:root`).

**Why (implied):** Design choice for a developer/freelancer tool. No toggle exists.

**Implications:**
- All colors are hardcoded to dark values
- Adding light mode later would require refactoring all color references to use the existing CSS variables (which are already well-structured for this)

---

## 7. Inline event handlers throughout

**What:** `onclick`, `onsubmit`, `oninput`, `ondragstart` etc. are used directly in `index.html` HTML attributes.

**Why (implied):** Fastest way to wire up a vanilla JS SPA without a framework.

**Implications:**
- All handler functions must be global
- No event delegation pattern
- Difficult to test in isolation
- CSP (Content Security Policy) would require `unsafe-inline`

---

## 8. Single modal overlay for all modals

**What:** One `#modal-overlay` div contains all 6 modal content divs. Only one is shown at a time via `showModal(id)`.

**Why:** Simplifies modal management — single escape handler, single backdrop.

**Implications:**
- All modals share the same DOM tree
- Opening a modal hides all others first (`app.js:910`)
- No stacking, no concurrent modals

---

## 9. Activity log as array, not as a real log

**What:** `activity` is an in-memory array capped at 20 entries (`app.js:178`). Each entry has `text`, `time`, `created_at`.

**Why (implied):** Simple "recent activity" widget on dashboard.

**Implications:**
- Activity is lost on page reload in Supabase mode (fetched fresh each time)
- No entity association — activity entries are plain text strings
- No pagination, no filtering

---

## 10. Schema drift between README and schema.sql

**What:** README lists 9 tables (`profiles`, `email_events`, `invoice_items`, `activity_log`) but `schema.sql` only defines 6 tables. No `profiles`, `email_events`, `invoice_items`, or `activity_log` tables exist.

**Why:** README was likely written from a design doc; schema was simplified for MVP.

**Implication:** `schema.sql` is the source of truth. README is outdated on this point.
