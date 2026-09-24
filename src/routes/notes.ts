import { Router } from 'express';
import { NoteService } from '../services/NoteService';
import { NoteController } from '../controllers/NoteController';

// Contrato HTTP fijo (no lo cambien):
//   POST   /notes
//   GET    /notes
//   GET    /notes/:id
//   PATCH  /notes/:id
//   DELETE /notes/:id
//
// Esta capa solo define el ruteo: mapea cada endpoint al método del
// NoteController correspondiente. Toda la validación y la lógica de
// request/response vive en src/controllers/NoteController.ts, que a su vez
// delega en NoteService. Los tests de integración (Supertest) de cada
// ejercicio prueban esta capa (a través de la app completa).

export function makeNotesRouter(service: NoteService) {
  const router = Router();
  const controller = new NoteController(service);

  router.post('/', controller.create);
  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
}
