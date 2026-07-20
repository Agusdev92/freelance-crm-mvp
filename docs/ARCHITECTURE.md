# Architecture

## Overview

FreelanceAI is a vanilla JavaScript single-page application with no build step, no framework, and no package manager. All code is plain ES loaded via `<script>` tags in `index.html`. The backend is optional — when Supabase is configured, data lives in Postgres with RLS; otherwise, everything falls back to `localStorage`.

## File Structure

```
freelance-crm-mvp/
├── index.html      # SPA shell: auth screens, sidebar, views, modals (522 lines)
├── styles.css      # Dark theme, responsive layout, Kanban, modals (759 lines)
├── app.js          # All application logic: state, auth, CRUD, UI (921 lines)
├── supabase.js     # Supabase client, auth wrappers, DB CRUD, OpenAI proxy (265 lines)
├── config.js       # API key management in localStorage (30 lines)
├── schema.sql      # Supabase schema: 6 tables + RLS + indexes (133 lines)
├── README.md       # Documentation in Spanish
└── AGENTS.md       # AI agent instructions
```

## Script Load Order

Defined at the bottom of `index.html` (lines 518-520). This order is critical — later files depend on globals from earlier ones:

```
1. config.js      → getConfig(), saveConfig(), toggleConfig()
2. supabase.js    → initSupabase(), auth wrappers, DB CRUD, OpenAI proxy
3. app.js         → all UI logic, state management, event handlers
```

All functions are global. There are no ES modules, no imports, no exports.

## Dual-Mode Backend

The global `useSupabase` boolean (defined in `supabase.js:3`) controls which backend is active:

- **Supabase configured** (URL + anon key present in config): Auth via `supabase.auth`, data via `supabase.from(table)`, all queries filtered by `user_id = auth.uid()`.
- **No config**: Auth uses `localStorage` (`freelanceai_user`, `freelanceai_users`). Data stored per-user under keys like `freelanceai_contacts_{userId}`.

Every database function checks `useSupabase` before deciding which path to take. The toggle happens at startup in `initSupabase()` (`supabase.js:5-14`).

## External Dependencies

Loaded via CDN in `index.html`:
- **Supabase JS v2** (`unpkg.com/@supabase/supabase-js@2`) — line 9
- **Google Fonts** (Inter) — line 8

No other dependencies. No npm, no node_modules, no package.json.

## Data Flow

### Authentication
1. `DOMContentLoaded` → `initSupabase()` → `checkAuth()` (`app.js:14-17`)
2. If Supabase: `supabaseGetUser()` checks session
3. If localStorage: checks `freelanceai_user` key
4. On success: `loadUserData()` → `showApp()`

### Data Persistence
- `loadUserData()` (`app.js:133-156`): Fetches all 6 collections in parallel
- `saveData()` (`app.js:158-168`): Writes all 6 collections to localStorage (Supabase mode skips this)
- Each CRUD operation calls `loadUserData()` after write to refresh state

### Navigation
- `switchView(view)` (`app.js:188-201`): Toggles `.active` class on views
- Each view has its own render function (`renderContacts`, `renderPipeline`, etc.)
- Modals managed by `showModal(id)` / `closeModal()` with overlay + Escape key

## UI Structure

### Screens
1. **Auth screen** (`#auth-screen`): Login form, register form, config panel
2. **App screen** (`#app-screen`): Sidebar + main content area

### Views (inside app screen)
- **Dashboard** (`#view-dashboard`): 4 stat cards, recent deals list, activity feed
- **Contacts** (`#view-contacts`): Search bar + data table with CRUD
- **Pipeline** (`#view-pipeline`): 4-column Kanban board (lead/proposal/negotiation/closed)
- **Proposals** (`#view-proposals`): Card list, click to view detail
- **Emails** (`#view-emails`): Search bar + data table, simulate open tracking
- **Invoices** (`#view-invoices`): 4 stat cards + data table with status

### Modals (inside `#modal-overlay`)
- Contact modal, Deal modal, Proposal modal, Proposal detail modal, Email modal, Invoice modal
- All share a single overlay; only one visible at a time

## Database Schema

Six tables in `schema.sql`, all with `user_id UUID REFERENCES auth.users(id)` and RLS policies (`auth.uid() = user_id`):

| Table | Key Fields | Relationships |
|-------|-----------|---------------|
| `contacts` | name, email, company, phone, tags[], notes | — |
| `deals` | name, contact_id, value, stage (enum), notes | → contacts |
| `proposals` | project, client, type, budget, duration, content | — |
| `emails` | contact_id, subject, body, sent_at, opened | → contacts |
| `invoices` | contact_id, number, concept, amount, status (enum), due_date | → contacts |
| `activity` | text, time | — |

Indexes on all `user_id` columns plus `deals.stage` and `invoices.status`.

## Keyboard / Interaction

- Escape key closes any open modal (`app.js:919-921`)
- Kanban drag-and-drop uses native HTML5 DnD API (`dragstart`, `dragover`, `drop`, `dragleave`)
- Contact search and email search filter on `input` event

## Responsive Breakpoints

Defined in `styles.css`:
- `≤1024px`: Stats grid → 2 columns, Kanban → 2 columns
- `≤768px`: Sidebar hidden, everything single-column
