import type Database from 'better-sqlite3';
import { Note, NewNote, NotePatch } from '../models/Note';

// Esta interfaz es el CONTRATO fijo del repositorio. No la modifiquen:
// NoteService depende de estos nombres exactos.
export interface NoteRepository {
  create(data: NewNote): Note;
  findAll(): Note[];
  findById(id: number): Note | undefined;
  update(id: number, patch: NotePatch): Note | undefined;
  delete(id: number): boolean;
  clear(): void;
}

// Implementación con SQLite YA RESUELTA. La capa de acceso a datos
// no es el objetivo de este práctico: lo que sí van a testear ustedes
// es la capa de arriba (NoteService) y las rutas HTTP.
export class SqliteNoteRepository implements NoteRepository {
  constructor(private readonly db: Database.Database) {}

  create(data: NewNote): Note {
    const now = new Date().toISOString();
    const stmt = this.db.prepare(
      `INSERT INTO notes (title, content, pinned, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)`
    );
    const info = stmt.run(data.title, data.content, data.pinned ? 1 : 0, now, now);
    return this.findById(Number(info.lastInsertRowid))!;
  }

  findAll(): Note[] {
    const rows = this.db.prepare(`SELECT * FROM notes ORDER BY id`).all();
    return rows.map(rowToNote);
  }

  findById(id: number): Note | undefined {
    const row = this.db.prepare(`SELECT * FROM notes WHERE id = ?`).get(id);
    return row ? rowToNote(row) : undefined;
  }

  update(id: number, patch: NotePatch): Note | undefined {
    const existing = this.findById(id);
    if (!existing) return undefined;

    const merged = { ...existing, ...patch, updatedAt: new Date().toISOString() };
    this.db
      .prepare(`UPDATE notes SET title = ?, content = ?, pinned = ?, updatedAt = ? WHERE id = ?`)
      .run(merged.title, merged.content, merged.pinned ? 1 : 0, merged.updatedAt, id);

    return this.findById(id);
  }

  delete(id: number): boolean {
    const info = this.db.prepare(`DELETE FROM notes WHERE id = ?`).run(id);
    return info.changes > 0;
  }

  clear(): void {
    this.db.exec(`DELETE FROM notes`);
  }
}

function rowToNote(row: any): Note {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    pinned: !!row.pinned,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
}
