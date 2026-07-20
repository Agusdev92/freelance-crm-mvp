# FreelanceAI - CRM Inteligente

CRM profesional para freelancers y pequeñas agencias. Contactos, pipeline Kanban, propuestas con IA, email tracking y facturación.

## Stack

| Capa | Tech |
|------|------|
| Frontend | React 19, TypeScript, Vite, TailwindCSS v4 |
| Backend | Supabase (Postgres + RLS) + localStorage fallback |
| IA | OpenAI API (gpt-4o-mini) + generador offline |
| Routing | React Router v7 |
| State | React Context + hooks |

## Estructura

```
src/
├── lib/           # Config, tipos, utils
├── services/      # Un archivo por dominio (SRP)
├── hooks/         # Un hook por módulo (useAuth, useContacts, etc.)
├── components/
│   ├── ui/        # Design system (Button, Modal, Input, etc.)
│   ├── layout/    # Sidebar, AppLayout
│   └── auth/      # LoginPage
└── pages/         # Una página por vista
```

## Setup

```bash
git clone https://github.com/Agusdev92/freelance-crm-mvp.git
cd freelance-crm-mvp
npm install
cp .env.example .env    # Configurar Supabase/OpenAI (opcional)
npm run dev
```

## Variables de entorno

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `VITE_SUPABASE_URL` | No | URL del proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | No | Clave anon de Supabase |
| `VITE_OPENAI_API_KEY` | No | API Key de OpenAI |

Sin variables configuradas, la app funciona 100% offline con `localStorage`.

## Database

Ejecutar `supabase/schema.sql` en Supabase SQL Editor. Crea tablas, RLS policies e índices.

## Scripts

```bash
npm run dev      # Desarrollo
npm run build    # Build producción
npm run preview  # Preview build
```

## Deuda Técnica Pendiente

- [ ] Tests (Vitest + Testing Library)
- [ ] Edge Functions para OpenAI (no exponer key en cliente)
- [ ] Paginación cursor-based
- [ ] PWA (service worker)
- [ ] CI/CD (GitHub Actions)
- [ ] ESLint + Prettier
