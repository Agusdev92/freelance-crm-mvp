# Versioning

Estrategia de versionado del proyecto FreelanceAI CRM MVP.

---

## Formato

Se utiliza [Semantic Versioning](https://semver.org/lang/es/) (SemVer):

```
MAJOR.MINOR.PATCH
```

- **MAJOR** (`X.0.0`): Cambios incompatibles con versiones anteriores. Migración de schema, eliminación de funcionalidades, cambio de stack.
- **MINOR** (`0.X.0`): Nuevas funcionalidades compatibles con versiones anteriores. Nuevas vistas, nuevos campos en tablas (sin romper existentes), mejoras de UX.
- **PATCH** (`0.0.X`): Correcciones de bugs que no cambian la interfaz. Fixes de UI, correcciones de schema, cambios de textos.

---

## Estado actual

El proyecto está en **`0.1.0`** — primera versión funcional (MVP). No hay releases anteriores.

No existen tags en el repositorio. El primer tag será `v0.1.0`.

---

## Commits

Se utiliza [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/) como guía:

```
tipo(alcance): descripción
```

Tipos relevantes para este proyecto:

| Tipo | Uso |
|------|-----|
| `feat` | Nueva funcionalidad visible por el usuario |
| `fix` | Corrección de bug |
| `docs` | Solo cambios en documentación |
| `refactor` | Reestructuración sin cambio de comportamiento |
| `style` | Cambios de CSS, sin cambio de lógica |
| `chore` | Configuración, tooling, tareas de mantenimiento |

Ejemplos:
```
feat: agregar vista de reportes con gráficos
fix: corregir drag-and-drop en pipeline
docs: actualizar DECISIONS.md con nueva decisión
refactor: dividir app.js en módulos por feature
```

---

## Cuándo incrementar cada número

### MAJOR — cuándo sí

- Migración de vanilla JS a TypeScript + Vite (requiere `package.json`, tsconfig, cambio de import/export).
- Cambio de Supabase a otro backend.
- Eliminación de funcionalidades existentes.
- Cambio de estructura de `localStorage` que rompa datos existentes del usuario.

### MAJOR — cuándo no

- Agregar una nueva tabla a `schema.sql` (compatibilidad hacia atrás).
- Agregar una nueva vista al SPA.

### MINOR — cuándo sí

- Agregar una nueva tabla con RLS.
- Agregar una nueva vista (ej: Reportes).
- Agregar campos nuevos a tablas existentes (sin eliminar ni renombrar).
- Agregar nueva funcionalidad a una vista existente.

### PATCH — cuándo sí

- Corregir un bug de UI.
- Corregir un texto mal escrito.
- Corregir una query SQL incorrecta.
- Actualizar documentación.

---

## Tags

Los tags se crean en el formato `vX.Y.Z`:

```bash
git tag -a v0.1.0 -m "MVP: CRM para freelancers"
git push origin v0.1.0
```

El CHANGELOG referencia estos tags al final de cada sección.

---

## Ramas

- **`main`**: Código estable. Cada tag apunta a un commit en `main`.
- **`feature/*`**: Ramas de desarrollo para funcionalidades nuevas. Se mergean a `main` cuando están listas.

No hay protección de rama configurada actualmente (sin CI/CD).

---

## Nota sobre el MVP actual

El estado actual (`0.1.0`) es un MVP funcional con limitaciones conocidas documentadas en `docs/TECH_DEBT.md`. Las siguientes breaking changes son probables antes de `1.0.0`:

- Migración a TypeScript + Vite (cambia estructura de archivos y sistema de módulos).
- Posible eliminación de la autenticación por localStorage (solo queda Supabase).
- Reestructuración de `app.js` en módulos separados.

Por lo tanto, se recomienda tratar todas las versiones `0.x.y` como inestables y sin garantía de compatibilidad entre menores.
