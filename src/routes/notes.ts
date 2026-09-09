import { Router } from 'express';
import { z } from 'zod';
import { NoteService } from '../services/NoteService';

// Contrato HTTP fijo (no lo cambien):
//   POST   /notes
//   GET    /notes
//   GET    /notes/:id
//   PATCH  /notes/:id
//   DELETE /notes/:id
//
// Esta capa ya está resuelta: valida con Zod en el borde (safeParse, nunca
// parse) y delega toda la lógica de negocio en NoteService. Los tests de
// integración (Supertest) de cada ejercicio prueban esta capa.

const createSchema = z.object({
  title: z.string().min(1, 'title es requerido'),
  content: z.string().min(1, 'content es requerido'),
  pinned: z.boolean().optional()
});

const patchSchema = createSchema.partial();

export function makeNotesRouter(service: NoteService) {
  const router = Router();

  router.post('/', (req, res) => {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'ValidationError', details: parsed.error.flatten() });
    }
    const note = service.createNote(parsed.data);
    res.status(201).json(note);
  });

  router.get('/', (_req, res) => {
    res.json(service.listNotes());
  });

  router.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    const note = service.getNote(id);
    if (!note) return res.status(404).json({ error: 'NotFound' });
    res.json(note);
  });

  router.patch('/:id', (req, res) => {
    const id = Number(req.params.id);
    const parsed = patchSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'ValidationError', details: parsed.error.flatten() });
    }
    const updated = service.updateNote(id, parsed.data);
    if (!updated) return res.status(404).json({ error: 'NotFound' });
    res.json(updated);
  });

  router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    const ok = service.deleteNote(id);
    if (!ok) return res.status(404).json({ error: 'NotFound' });
    res.status(204).send();
  });

  return router;
}
