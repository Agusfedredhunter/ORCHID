// Contrato de datos de la API. NO cambien los nombres de estos campos:
// los tests (propios y los de la cátedra) dependen de ellos.

export interface Note {
  id: number;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewNote {
  title: string;
  content: string;
  pinned?: boolean;
}

export interface NotePatch {
  title?: string;
  content?: string;
  pinned?: boolean;
}
