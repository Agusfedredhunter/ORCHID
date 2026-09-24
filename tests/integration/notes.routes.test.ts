import request from 'supertest';
import { describe, expect, it, beforeEach } from 'vitest';
import { makeApp } from '../../src/app';

describe('Rutas DELETE /notes/:id', () => {
  let app: ReturnType<typeof makeApp>;

  beforeEach(() => {
    app = makeApp(':memory:');
  });

  it('DELETE /notes/:id debe eliminar la nota y devolver status 204', async () => {
    // 1. Precondición: Creamos una nota para poder borrarla
    const created = await request(app)
      .post('/notes')
      .send({ title: 'A borrar', content: 'Chao' });

    // 2. Acción: Ejecutamos TU código del Ejercicio 5 (DELETE)
    const res = await request(app).delete(`/notes/${created.body.id}`);
    
    // 3. Aserción: Comprobamos que el servidor responde que se borró correctamente
    expect(res.status).toBe(204);
  });

  it('DELETE /notes/:id debe responder 404 si la nota no existe', async () => {
    // Acción: Intentamos borrar una nota que no existe
    const res = await request(app).delete('/notes/9999');
    
    // Aserción: Comprobamos que el servidor responde 404 Not Found
    expect(res.status).toBe(404);
  });
});