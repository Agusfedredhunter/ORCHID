import { describe, it, expect, beforeEach } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection';

// 🟢 EJERCICIO 2: listNotes
// Escríbanlo ustedes cubriendo al menos "lista vacía" y "varias notas".
describe('NoteService - listNotes (Ejercicio 2)', () => {
  let service: NoteServiceImpl;

  beforeEach(() => {
    const db = createDb(':memory:');
    const repo = new SqliteNoteRepository(db);
    service = new NoteServiceImpl(repo);
  });

  it('devuelve una lista vacía cuando no hay notas', () => {
    expect(service.listNotes()).toEqual([]);
  });

  it('devuelve todas las notas creadas', () => {
    service.createNote({ title: 'Comprar pan', content: 'Antes de las 20hs' });
    service.createNote({ title: 'Estudiar', content: 'Para el parcial' });

    const notes = service.listNotes();

    expect(notes).toHaveLength(2);
    expect(notes.map((note) => note.title)).toEqual(['Comprar pan', 'Estudiar']);
  });
});
