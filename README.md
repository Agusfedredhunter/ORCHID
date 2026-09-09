# Notes API — Práctico de Testing (TUPProIV)

API REST de notas (crear, listar, leer, modificar, eliminar) con TypeScript +
Express + SQLite. El objetivo es completar el proyecto siguiendo TDD
(Rojo → Verde → Refactor), usando Vitest, Supertest y Playwright.

## Stack

- Node 18+ / npm
- TypeScript + Express
- **SQLite** (`better-sqlite3`)
- Zod (validación en los bordes)
- **Vitest** + Supertest (unitarios e integración)
- **Playwright Test** (E2E)

## Instalación

```bash
npm install
npm run dev          # levanta el server en http://localhost:3000
```

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo (con recarga automática) |
| `npm test` | Corre los tests unitarios y de integración (Vitest) |
| `npm run test:watch` | Vitest en modo watch |
| `npm run coverage` | Reporte de cobertura (`coverage/lcov-report/index.html`) |
| `npm run test:e2e` | Corre los tests E2E (levanta el server solo para eso) |
| `npm run report:e2e` | Abre el reporte HTML de Playwright |

## Estructura

```
src/
  models/Note.ts            # Contrato de datos (Note, NewNote, NotePatch)
  db/connection.ts          # SQLite — YA RESUELTO
  repositories/
    NoteRepository.ts       # Interfaz + implementación SQLite — YA RESUELTO
  services/
    notificationService.ts  # "Servicio externo" a mockear (Ejercicio 6)
    NoteService.ts          # ACÁ TRABAJAN — interfaz fija + 5 métodos a implementar
  routes/notes.ts           # Rutas HTTP — YA RESUELTO
  app.ts / server.ts        # Armado de la app — YA RESUELTO
tests/unit/                 # Sus tests unitarios de NoteService
tests/integration/          # Sus tests de integración de las rutas (Supertest)
e2e/
  helpers.ts                 # reset/seed — YA RESUELTO
  notes.e2e.spec.ts          # Ejercicio 7 — lo crean ustedes
```

## ⚠️ No cambiar

Estos nombres son el contrato que van a usar los tests de la cátedra para
corregir. Pueden agregar código, pero **no renombrar ni cambiar la firma**
de:

- Los 5 métodos de `NoteService`: `createNote`, `listNotes`, `getNote`,
  `updateNote`, `deleteNote`.
- Las rutas HTTP: `POST/GET /notes`, `GET/PATCH/DELETE /notes/:id`.
- Los campos de `Note`: `id`, `title`, `content`, `pinned`, `createdAt`,
  `updatedAt`.
- El nombre y la firma de `notify` en `src/services/notificationService.ts`.
- El **nombre de archivo** de cada test de ejercicio (tabla de abajo). No es
  un capricho: tanto el corrector automático como la verificación de TDD
  por commits (ver más abajo) buscan estos archivos por su nombre exacto.

## Los ejercicios

Todo el trabajo pasa por `src/services/NoteService.ts` (tiene comentarios
`EJERCICIO N` marcando qué hacer en cada método) y sus tests en
`tests/unit/` y `tests/integration/`.

| # | Ejercicio | Archivo de test (nombre fijo) | Punto de partida | Tarea |
|---|---|---|---|---|
| 1 | Crear nota | `tests/unit/noteService.create.test.ts` | Test ya escrito, en **rojo** | Implementar `createNote` hasta que pase |
| 2 | Listar notas | `tests/unit/noteService.list.test.ts` | Implementación ya en **verde** | Escribirlo ustedes |
| 3 | Obtener nota por id | `tests/unit/noteService.get.test.ts` | Nada | Ciclo completo, incluyendo id inexistente → `undefined` / 404 |
| 4 | Modificar nota | `tests/unit/noteService.update.test.ts` | Nada | Ciclo completo — es un *patch* parcial |
| 5 | Eliminar nota | `tests/unit/noteService.delete.test.ts` | Nada | Ciclo completo |
| 6 | Notificación al fijar (`pinned: true`) | `tests/unit/noteService.notify.test.ts` | Nada | Ciclo completo + **mock** de `notificationService` con `vi.mock` |
| 7 | Flujo E2E completo | `e2e/notes.e2e.spec.ts` | Helper de reset/seed ya armado (`e2e/helpers.ts`) | 1 happy path + 1 caso de error |

Para cada uno de los ejercicios 3 a 5 escriban **tanto** el test unitario de
`NoteService` **como** el test de integración de la ruta correspondiente
(`tests/integration/notes.routes.test.ts`, montando `makeApp(':memory:')`
con Supertest).

El Ejercicio 6 depende de que el 1 ya esté resuelto (extiende el mismo
método `createNote`). El Ejercicio 7 depende de que 1 a 6 estén resueltos:
el endpoint `/__test__/seed` usa `createNote` para poblar datos, así que
hasta que esté implementado, `npm run test:e2e` va a fallar al levantar el
server de prueba.

## Commits: cómo demostrar que hicieron TDD de verdad

Para cada ejercicio (donde escriban el test ustedes: 2, 3, 4, 5, 6 y 7)
tienen que hacer **al menos dos commits separados**, en este orden:

1. Un commit que agregue **solo el test** (el archivo de la tabla de
   arriba), en rojo. Mensaje sugerido: `test: <ejercicio> (rojo)`.
2. Uno o más commits que agreguen **la implementación** en `src/`, hasta
   dejarlo en verde. Mensaje sugerido: `feat: <ejercicio> (verde)`.

**No hagan un solo commit que agregue el test y la implementación juntos.**
La cátedra corre un script que revisa el historial de git de cada archivo
de test: si el commit que lo introduce ya pasa (o si el mismo commit
también toca `src/`), no hay forma de verificar por afuera que el test se
escribió antes que el código — y eso se nota en la evaluación de la
evidencia de TDD.

## Ejemplos curl

```bash
curl -X POST http://localhost:3000/notes -H "Content-Type: application/json" \
  -d '{"title":"Comprar pan","content":"Antes de las 20hs"}'

curl http://localhost:3000/notes

curl -X PATCH http://localhost:3000/notes/1 -H "Content-Type: application/json" \
  -d '{"content":"Antes de las 21hs"}'

curl -X DELETE http://localhost:3000/notes/1
```

## CI (GitHub Actions)

El repo trae un workflow en `.github/workflows/ci.yml` que corre solo, en
cada `push` y en cada Pull Request:

1. Instala dependencias y chequea tipos (`tsc --noEmit`).
2. Corre `npm test` (unitarios + integración) con cobertura.
3. Si lo anterior pasa, instala Playwright y corre `npm run test:e2e`.

Van a ver una ✗ roja en GitHub hasta que los tests correspondientes estén
resueltos, y una ✓ verde cuando pasen — es el mismo semáforo Rojo/Verde de
TDD, pero visible para todo el grupo en cada commit. No hace falta que
configuren nada: ya está activo apenas suben el repo a GitHub.

## Entregables y rúbrica

Ver el documento del Trabajo Práctico (matriz de casos, cobertura mínima,
preguntas de teoría y rúbrica de puntaje).
