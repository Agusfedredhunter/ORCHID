import { request, expect } from '@playwright/test';

// Helper YA RESUELTO (no es parte del Ejercicio 7).
// Deja el servidor en un estado conocido antes de cada test E2E:
// primero limpia todo, después siembra 2 notas fijas.
export async function resetAndSeed(baseURL: string) {
  const ctx = await request.newContext({ baseURL });
  await ctx.post('/__test__/reset');
  const res = await ctx.post('/__test__/seed');
  expect(res.status()).toBe(201);
  const data = await res.json();
  await ctx.dispose();
  return data;
}
