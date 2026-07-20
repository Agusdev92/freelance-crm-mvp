# Technical Debt

Known issues, code smells, and missing capabilities. Each item includes where it lives and its impact.

---

## Critical

### OpenAI API key exposed to browser
- **Where:** `supabase.js:114-118` — API key sent in `Authorization` header via `fetch()`
- **Impact:** Anyone can see the key in browser DevTools → Network tab. Can be abused for unlimited API calls.
- **Fix:** Route through a server-side proxy or edge function.

### localStorage auth has no real security
- **Where:** `app.js:64-76` — login checks plaintext password from `localStorage`
- **Impact:** Passwords stored in plaintext. No session management. Any user can access any data.
- **Fix:** Acceptable for offline demo only. Never deploy with real users in this mode.

---

## High

### app.js is a monolith (921 lines)
- **Where:** `app.js` — contains ALL application logic: auth, state, navigation, CRUD for 6 entities, drag-and-drop, modals, rendering.
- **Impact:** Difficult to reason about, test, or modify without side effects.
- **Fix:** Split into per-feature modules (contacts.js, deals.js, proposals.js, etc.).

### styles.css is a monolith (759 lines)
- **Where:** `styles.css` — single file for all components, views, and responsive rules.
- **Impact:** Hard to maintain as features grow. No CSS scoping.
- **Fix:** Split into component files or use CSS modules with a build step.

### No tests
- **Where:** Nowhere — no test files, no test framework, no test config.
- **Impact:** No safety net for regressions. Cannot verify changes confidently.
- **Fix:** Add unit tests (Vitest) and E2E tests (Playwright). Requires `package.json` first.

---

## Medium

### README is inaccurate
- **Where:** `README.md`
- **Issues:**
  - Lists 9 tables but `schema.sql` has 6 (no `profiles`, `email_events`, `invoice_items`, `activity_log`)
  - Says localStorage key is `crm_config` but code uses `freelanceai_config` (`config.js:2`)
  - Says `gpt-4o-mini` but code uses `gpt-3.5-turbo` (`supabase.js:122`)
  - Lists `npm run lint` and `npx tsc --noEmit` as "useful scripts" but neither exists
- **Impact:** Developers following the README will hit confusion.

### Duplicate ID matching pattern
- **Where:** Throughout `app.js` — `c.id === id || c.id === parseInt(id)`
- **Impact:** Supabase returns string UUIDs, localStorage uses `Date.now()` integers. Every lookup needs both checks. Fragile and repetitive.
- **Fix:** Normalize IDs at the data layer.

### No input sanitization
- **Where:** All `innerHTML` assignments in `app.js` (e.g., `app.js:262`, `app.js:384`, `app.js:553`)
- **Impact:** If user-controlled data contains HTML/script tags, it could execute (XSS). Supabase RLS doesn't prevent this.
- **Fix:** Use `textContent` for user data, or sanitize before inserting into HTML.

### Activity log is unbounded array capped at 20
- **Where:** `app.js:178` — `if (activity.length > 20) activity.pop()`
- **Impact:** Only last 20 actions are kept. No persistence strategy for history.
- **Fix:** Store in DB with proper pagination.

### No error boundaries
- **Where:** Most async functions use `try/catch` with `alert()` (`app.js:62`, `app.js:334`, etc.)
- **Impact:** Errors shown as browser alerts. No retry logic, no fallback UI.
- **Fix:** Add toast notifications and proper error handling.

### Invoice number auto-generation is fragile
- **Where:** `app.js:847` — `INV-${Date.now().toString().slice(-6)}`
- **Impact:** Could produce duplicate numbers if two invoices are created in the same millisecond.
- **Fix:** Use a counter or UUID-based scheme.

---

## Low

### No favicon
- **Where:** `index.html` — no `<link rel="icon">`
- **Impact:** Browser shows default icon. Minor UX issue.

### No meta tags for sharing
- **Where:** `index.html` — no `og:title`, `og:description`, `og:image`
- **Impact:** Links shared on social media show generic preview.

### CSS uses `-webkit-background-clip` without standard fallback
- **Where:** `styles.css:57`, `styles.css:175` (two occurrences, no standard `background-clip: text` fallback)
- **Impact:** Gradient text won't work in Firefox without `background-clip: text` (standard property).
- **Fix:** Add `background-clip: text` before the `-webkit-` prefixed version.

### No accessibility attributes
- **Where:** Throughout `index.html` — no `aria-label`, `role`, or `alt` attributes on interactive elements
- **Impact:** Screen readers and keyboard navigation are not supported.

### No loading states
- **Where:** `generateProposal()` has a button text change (`app.js:587-588`), but other async operations have no loading indicator
- **Impact:** User may click multiple times or not know if an action is processing.
