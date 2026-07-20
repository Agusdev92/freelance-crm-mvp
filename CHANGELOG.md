# Changelog

El formato de este archivo se basa en [Keep a Changelog](https://keepachangelog.com/es/1.1.0/).

## [Unreleased]

### Added
- Documentación técnica en `docs/`: ARCHITECTURE, DECISIONS, TECH_DEBT, ROADMAP, CONTRIBUTING.
- Instrucciones para agentes de IA en `AGENTS.md`.
- Este archivo `CHANGELOG.md`.
- Estrategia de versionado en `VERSIONING.md`.

## [0.1.0] - 2026-07-20

### Added
- **Auth:** Login y registro con email/password. Modo Supabase (Postgres + RLS) y fallback localStorage.
- **Config panel:** Formulario para ingresar Supabase URL/Key y OpenAI API Key. Claves guardadas en `localStorage`.
- **Contactos:** CRUD completo con búsqueda por nombre, email, empresa y tags. Tabla con acciones editar/eliminar.
- **Pipeline Kanban:** 4 columnas (Lead, Propuesta, Negociación, Cerrado). Drag-and-drop nativo del navegador.
- **Propuestas IA:** Generador con OpenAI (`gpt-3.5-turbo`). Fallback offline con plantilla basada en tipo de servicio. Copiar al portapapeles.
- **Email Tracking:** Registro manual de emails enviados. Simulación de apertura. Búsqueda por contacto y asunto.
- **Facturación:** CRUD de facturas con numeración automática, estados (Pendiente/Pagado/Vencido/Cancelado), y estadísticas.
- **Dashboard:** 4 tarjetas KPI (contactos, deals activos, pipeline total, propuestas). Lista de deals recientes. Feed de actividad.
- **Actividad:** Log de últimas 20 acciones del usuario.
- **Schema SQL:** 6 tablas (`contacts`, `deals`, `proposals`, `emails`, `invoices`, `activity`) con RLS y índices en `schema.sql`.
- **UI:** Tema oscuro, responsive (breakpoints 1024px y 768px), sistema de modales con overlay, sidebar de navegación.
- **README:** Documentación en español con setup, esquema de BD, funcionalidades, despliegue y roadmap.

### Known Limitations
- API key de OpenAI expuesta al navegador (aceptable para MVP personal).
- Auth en localStorage almacena contraseñas en texto plano.
- Sin tests, sin linting, sin formatter.
- `app.js` es un monolito de 921 líneas.
- README contiene informacion incorrecta (clave localStorage, modelo de IA, tablas inexistentes).

[Unreleased]: https://github.com/Agusdev92/freelance-crm-mvp/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Agusdev92/freelance-crm-mvp/releases/tag/v0.1.0
