# FreelanceAI — Documentación

Índice de documentación técnica del proyecto. Todo lo que aquí se describe está verificado contra el código fuente.

---

## Documentos

| Documento | Para qué sirve |
|-----------|----------------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Cómo está cableado el sistema: estructura de archivos, orden de carga de scripts, backend dual (Supabase + localStorage), flujo de datos, estructura de UI, esquema de BD, breakpoints responsive. |
| [DECISIONS.md](DECISIONS.md) | 10 decisiones técnicas clave visibles en el código: vanilla JS sin framework, sin build step, backend dual, OpenAI desde el navegador, desajuste de modelo, tema oscuro, handlers inline, modal único, activity log, drift entre README y schema. |
| [TECH_DEBT.md](TECH_DEBT.md) | Deuda técnica conocida organizada por severidad (Crítica / Alta / Media / Baja): API expuesta, auth en plaintext, monolitos, sin tests, sin linting, README incorrecto, XSS por innerHTML, numeración frágil, sin favicon, sin accesibilidad. |
| [ROADMAP.md](ROADMAP.md) | Estado actual verificado vs funcionalidades planificadas (del README, ninguna iniciada) + ítems no listados pero necesarios. |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Cómo trabajar en este codebase: prerrequisitos, desarrollo local, convenciones de código,ómo agregar features/tables, patrón dual-mode, checklist de testing manual, trampas comunes. |

---

## Lectura recomendada

- **Nuevo en el proyecto:** Empezar por [CONTRIBUTING.md](CONTRIBUTING.md) → [ARCHITECTURE.md](ARCHITECTURE.md).
- **Entender por qué las cosas son así:** [DECISIONS.md](DECISIONS.md).
- **Saber qué falta antes de producción:** [TECH_DEBT.md](TECH_DEBT.md).
- **Ver qué viene y qué ya existe:** [ROADMAP.md](ROADMAP.md).

---

## Nota sobre exactitud

Todos los documentos en este directorio fueron generados a partir del código fuente y verificados línea por línea. Si encontrás una afirmación incorrecta, reportala como issue.
