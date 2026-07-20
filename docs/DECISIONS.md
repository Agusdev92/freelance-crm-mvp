# Technical Decisions

Key architectural choices visible in the codebase, with rationale and implications.

---

## 1. React 19 + TypeScript + Vite

**What:** Modern React with strict TypeScript and Vite as bundler/dev server.

**Why:** Type safety, fast HMR, code splitting, ecosystem support. Migrated from vanilla JS in Sprint 1.

**Implications:**
- All state managed via React hooks and context
- Components are the unit of UI, not DOM manipulation
- TypeScript strict mode catches errors at compile time
- Vite handles bundling, tree-shaking, and code splitting

---

## 2. Dual-mode backend (Supabase + localStorage)

**What:** The app works with or without a Supabase project. Toggle is `isSupabaseConfigured` boolean.

**Why:** Instant demo without account creation. Data persists in browser for quick testing.

**Implications:**
- Every service function has `if (isSupabaseConfigured && supabase) { ... } else { ... }` branches
- localStorage mode has no auth enforcement — any "user" can see any data
- Data keyed by `userId` in localStorage, but no migration path between modes

---

## 3. OpenAI called directly from browser

**What:** `generateProposal()` in `proposals.service.ts` sends the API key via `fetch()` to `api.openai.com`.

**Why:** No server-side code exists. Keeping it simple for MVP.

**Implications:**
- OpenAI API key is visible in browser network tab
- No rate limiting, no spending controls
- Acceptable for personal MVP use, not for production
- Fallback template generator exists for when no key is set

---

## 4. Dark theme only, no light mode

**What:** Tailwind CSS v4 `@theme` block defines a single dark color palette.

**Why:** Design choice for a developer/freelancer tool. Clean, professional look.

**Implications:**
- All colors hardcoded to dark values in `@theme`
- Adding light mode later requires refactoring to semantic color tokens

---

## 5. Context-based cross-cutting concerns

**What:** Toast notifications and Confirm dialogs use React Context providers (ToastContext, ConfirmContext).

**Why:** Avoids prop drilling, provides global access from any component, clean API via hooks (`useToast()`, `useConfirm()`).

**Implications:**
- Toast auto-dismisses after 4 seconds
- Confirm dialog returns `Promise<boolean>` — async/await pattern
- Both wrap the entire app in the provider hierarchy

---

## 6. Lazy-loaded routes with React.lazy

**What:** All 6 page components are loaded on demand via `React.lazy()` + `Suspense`.

**Why:** Reduces initial bundle size. Each page is a separate chunk (~3-7KB).

**Implications:**
- First paint is faster (only loads core + current page)
- Spinner shown while chunk loads
- Code splitting happens automatically via Vite

---

## 7. Responsive design with Tailwind breakpoints

**What:** Mobile-first approach. Sidebar hidden behind hamburger on mobile. Tables convert to card layouts.

**Why:** Freelancers use phones/tablets. Responsive is essential for real-world usage.

**Implications:**
- Sidebar uses CSS transitions for slide-in/out
- Tables have dual rendering: `<table>` (desktop) + card list (mobile)
- Grid layouts adapt: 1 col → 2 col → 4 col

---

## 8. ErrorBoundary as class component

**What:** Global error boundary wraps the entire app. Class component (React limitation — no hook-based error boundary).

**Why:** Catches rendering errors that would otherwise crash the entire app silently.

**Implications:**
- Shows user-friendly fallback UI with error message
- Logs error details to console for debugging
- "Reload page" button as recovery mechanism

---

## 9. Vitest for testing

**What:** Vitest with jsdom environment, React Testing Library for component tests.

**Why:** Fast, Vite-native, compatible with Jest API. RTL tests components the way users interact with them.

**Implications:**
- Tests run in jsdom (not real browser)
- localStorage mode services can be tested without mocking Supabase
- Component tests verify rendering, user interactions, and state changes
