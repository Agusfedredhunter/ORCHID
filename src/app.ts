import express from 'express';
import { makeNotesRouter } from './routes/notes';
import { NoteServiceImpl } from './services/NoteService';
import { SqliteNoteRepository } from './repositories/NoteRepository';
import { createDb } from './db/connection';
import { _getSentNotifications, _clearSentNotifications } from './services/notificationService';

// Factory: cada llamada crea una app + base nueva (útil para tests e
// integración: nada de estado compartido entre corridas).
//
// dbPath por defecto:
//  - ':memory:' si NODE_ENV=test (tests de integración y E2E)
//  - 'data/notes.sqlite' en desarrollo normal
export function makeApp(dbPath?: string) {
  const app = express();
  app.use(express.json());

  const resolvedPath = dbPath ?? (process.env.NODE_ENV === 'test' ? ':memory:' : 'data/notes.sqlite');
  const db = createDb(resolvedPath);
  const repo = new SqliteNoteRepository(db);
  const service = new NoteServiceImpl(repo);

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/notes', makeNotesRouter(service));

  // Endpoints de test: solo existen si NODE_ENV=test. Los usa Playwright
  // (ver e2e/helpers.ts) para dejar la base en un estado conocido antes
  // de cada test E2E, y también el corrector de la cátedra (ver carpeta
  // correccion/ del proyecto), que habla únicamente por HTTP con esta API.
  if (process.env.NODE_ENV === 'test') {
    app.post('/__test__/reset', (_req, res) => {
      repo.clear();
      _clearSentNotifications();
      res.sendStatus(204);
    });

    app.post('/__test__/seed', (_req, res) => {
      const a = service.createNote({ title: 'Comprar pan', content: 'Antes de las 20hs' });
      const b = service.createNote({
        title: 'Llamar al dentista',
        content: 'Turno de control',
        pinned: true
      });
      res.status(201).json({ created: [a, b] });
    });

    // Solo para verificación externa: qué notas dispararon una notificación
    // (Ejercicio 6). No forma parte del contrato que consume el front-end.
    app.get('/__test__/notifications', (_req, res) => {
      res.json(_getSentNotifications());
    });
  }

  return app;
}
