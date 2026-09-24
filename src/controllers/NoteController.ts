import { Request, Response } from 'express';
import { z } from 'zod';
import { NoteService } from '../services/NoteService';

// Contrato HTTP fijo (no lo cambien): lo define src/routes/notes.ts.
// Esta capa concentra la lógica por request: valida con Zod en el borde
// (safeParse, nunca parse) y delega toda la lógica de negocio en NoteService.

const createSchema = z.object({
  title: z.string().min(1, 'title es requerido'),
  content: z.string().min(1, 'content es requerido'),
  pinned: z.boolean().optional()
});

const patchSchema = createSchema.partial();

export class NoteController {
  constructor(private readonly service: NoteService) {}

  create = (req: Request, res: Response) => {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'ValidationError', details: parsed.error.flatten() });
    }
    const note = this.service.createNote(parsed.data);
    res.status(201).json(note);
  };

  list = (_req: Request, res: Response) => {
    res.json(this.service.listNotes());
  };

  getById = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const note = this.service.getNote(id);
    if (!note) return res.status(404).json({ error: 'NotFound' });
    res.json(note);
  };

  update = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const parsed = patchSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'ValidationError', details: parsed.error.flatten() });
    }
    const updated = this.service.updateNote(id, parsed.data);
    if (!updated) return res.status(404).json({ error: 'NotFound' });
    res.json(updated);
  };

  remove = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const ok = this.service.deleteNote(id);
    if (!ok) return res.status(404).json({ error: 'NotFound' });
    res.status(204).send();
  };
}
