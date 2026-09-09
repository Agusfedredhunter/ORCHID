import Database from 'better-sqlite3';

// createDb ya está resuelto: no es parte de los ejercicios.
// Con path=':memory:' (default) crea una base nueva en RAM, ideal para tests:
// rápida, aislada, y no deja archivos sueltos.
export function createDb(path: string = ':memory:'): Database.Database {
  const db = new Database(path);
  db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      pinned INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);
  return db;
}
