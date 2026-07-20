# Contributing

How to work in this codebase.

---

## Prerequisites

- A modern browser
- `npx` (for `npx serve .`) or Python 3 (for `python -m http.server`)
- No `npm install` needed — there is no `package.json`

## Local Development

```bash
git clone https://github.com/Agusdev92/freelance-crm-mvp.git
cd freelance-crm-mvp
npx serve .        # → http://localhost:3000
```

The app works immediately in localStorage mode. No backend setup required.

## Project Layout

All source files are at the root. There are no subdirectories (besides `.git/`).

| File | Lines | Role |
|------|-------|------|
| `index.html` | 522 | SPA shell, all HTML, script tags |
| `styles.css` | 759 | All CSS, dark theme |
| `app.js` | 921 | All application logic |
| `supabase.js` | 265 | Supabase client, auth, DB, OpenAI |
| `config.js` | 30 | API key storage |
| `schema.sql` | 133 | Database schema for Supabase |

## Script Load Order

Scripts load at the bottom of `index.html` in this exact order:

```
config.js → supabase.js → app.js
```

**Never change this order.** `app.js` calls functions from `supabase.js`, which calls functions from `config.js`. All functions are global — there are no imports.

## Code Conventions

- **Language:** All UI text is Spanish. Keep it consistent.
- **Functions:** All functions are global (no modules). Use descriptive names.
- **IDs:** Supabase uses UUIDs (strings). localStorage uses `Date.now()` (integers). Code handles both with `|| c.id === parseInt(id)` patterns.
- **Styling:** Dark theme only. Use CSS custom properties defined in `:root` (`styles.css:7-19`).
- **Modals:** Use `showModal(id)` / `closeModal()`. All modals live inside `#modal-overlay`.
- **Events:** Inline handlers (`onclick`, `onsubmit`) in HTML. Functions must be global.

## Adding a New Feature

1. **HTML:** Add the view/section in `index.html` inside `<main class="main-content">`
2. **CSS:** Add styles in `styles.css`
3. **JS:** Add logic in `app.js` (or `supabase.js` if it involves DB operations)
4. **Nav:** Add a nav item in the sidebar if it's a new view
5. **DB:** If it needs a new table, add it to `schema.sql` with RLS policies

## Adding a New Database Table

Follow the pattern in `schema.sql`:

```sql
CREATE TABLE IF NOT EXISTS your_table (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    -- your columns here
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own your_table" ON your_table FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own your_table" ON your_table FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own your_table" ON your_table FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own your_table" ON your_table FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_your_table_user_id ON your_table(user_id);
```

Then update `loadUserData()` and `saveData()` in `app.js` to include the new collection.

## Dual-Mode Pattern

Every feature that touches data must support both backends:

```javascript
if (useSupabase) {
    await supabaseInsert('table_name', data);
} else {
    data.id = Date.now();
    myArray.push(data);
    saveData();
}
```

Never assume one backend is active. Always branch on `useSupabase`.

## Testing Changes

There is no test suite. To verify manually:

1. Open the app in a browser
2. Test in **localStorage mode** (no config): Register, login, CRUD operations
3. Test in **Supabase mode** (with config): Same flows, verify data persists
4. Test **responsive**: Resize browser to ≤768px, verify sidebar hides and layout stacks
5. Test **Kanban drag-and-drop**: Move deals between columns
6. Test **proposal generation**: With and without OpenAI key
7. Test **modal Escape**: Press Escape while a modal is open

## Common Pitfalls

- **Changing script order** will break everything silently (no error messages)
- **Forgetting `useSupabase` check** will crash in one mode but not the other
- **Using `parseInt(id)`** on Supabase UUIDs will fail — always use `|| c.id === parseInt(id)` pattern
- **Adding English text** to the UI will break the Spanish-only convention
- **Not updating `loadUserData()`** when adding a table means the new data won't load on startup
