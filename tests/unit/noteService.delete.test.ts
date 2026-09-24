import { describe, expect, it, beforeEach } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection'; 

describe('NoteService - deleteNote', () => {
  let service: NoteServiceImpl;

  beforeEach(() => {
    const db = createDb(':memory:'); 
    const repo = new SqliteNoteRepository(db);
    service = new NoteServiceImpl(repo);
  });

  it('debe eliminar la nota existente y retornar true', () => {
    const created = service.createNote({ title: 'Eliminar', content: 'Nota a borrar' });
    const deleted = service.deleteNote(created.id);

    expect(deleted).toBe(true);
  });

  it('debe retornar false al intentar eliminar un ID inexistente', () => {
    const deleted = service.deleteNote(999);
    expect(deleted).toBe(false);
  });
});